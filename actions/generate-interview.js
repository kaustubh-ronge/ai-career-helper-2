"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

export async function generateInterviewQuestions(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    if (dbUser.interviewCredits <= 0) {
        return { success: false, error: "Insufficient Interview Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { jobPosition, jobDesc, jobExperience, techStack, difficulty } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   const prompt = `
      Role: You are a Hiring Manager at a top-tier tech company.
      
      Candidate Profile:
      - Applying for: ${jobPosition}
      - Years of Experience: ${jobExperience}
      - Tech Stack / Skills: ${techStack}
      - Job Description Snippet: ${jobDesc.slice(0, 1000)}
      
      Settings:
      - Interview Difficulty: ${difficulty}/10 (10 is extremely hard)`
    
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```(?:json)?|```/g, "").trim();

    // 3. Save & Deduct
    const mockInterview = await db.mockInterview.create({
      data: {
        userId: user.clerkUserId,
        jobPosition, jobDesc, jobExperience,
        jsonMockResp: cleanJson,
        status: "in-progress"
      },
    });

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: { interviewCredits: { decrement: 1 } }
    });

    revalidatePath("/dashboard/interview");
    return { success: true, id: mockInterview.id };

  } catch (error) {
    return { success: false, error: error.message };
  }
}