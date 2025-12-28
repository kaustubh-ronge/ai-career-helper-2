"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

export async function generateInterviewQuestions(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits (Ensure field name matches your Schema exactly, e.g., creditsInterview)
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    
    // Check if you use 'interviewCredits' or 'creditsInterview' in your Prisma schema
    if ((dbUser.creditsInterview || dbUser.interviewCredits || 0) <= 0) {
        return { success: false, error: "Insufficient Interview Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { jobPosition, jobDesc, jobExperience, techStack, difficulty } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // UPDATED PROMPT: Explicit instructions for JSON format
    const prompt = `
      Role: You are a Hiring Manager at a top-tier tech company.
      
      Candidate Profile:
      - Applying for: ${jobPosition}
      - Years of Experience: ${jobExperience}
      - Tech Stack / Skills: ${techStack}
      - Job Description Snippet: ${jobDesc.slice(0, 1000)}
      
      Settings:
      - Interview Difficulty: ${difficulty}/10 (10 is extremely hard)

      TASK:
      Generate 5 technical interview questions based on the candidate's profile. 
      Include a sample "ideal answer" for each question.

      IMPORTANT FORMATTING RULES:
      1. Output ONLY a raw JSON array. 
      2. Do NOT use Markdown code blocks (like \`\`\`json). 
      3. Do NOT add any conversational text (like "Here are your questions").
      
      REQUIRED JSON STRUCTURE:
      [
        {
          "question": "Question text here",
          "answer": "Ideal answer summary here"
        },
        ...
      ]
    `;
    
    const result = await model.generateContent(prompt);
    
    // Clean up if Gemini still adds markdown
    const cleanJson = result.response.text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // Verify it is valid JSON before saving
    // This will throw an error here (caught by catch block) instead of saving bad data
    JSON.parse(cleanJson); 

    // 3. Save & Deduct
    const mockInterview = await db.mockInterview.create({
      data: {
        userId: user.clerkUserId,
        jobPosition, 
        jobDesc, 
        jobExperience,
        jsonMockResp: cleanJson,
        status: "in-progress"
      },
    });

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        // Ensure this field name matches your Prisma Schema
        data: { creditsInterview: { decrement: 1 } } 
    });

    revalidatePath("/dashboard/interview");
    return { success: true, id: mockInterview.id };

  } catch (error) {
    console.error("Error generating interview:", error);
    return { success: false, error: error.message || "Failed to generate questions" };
  }
}