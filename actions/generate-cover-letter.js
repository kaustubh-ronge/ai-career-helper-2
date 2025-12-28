"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

export async function generateCoverLetter(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    if (dbUser.coverLetterCredits <= 0) {
        return { success: false, error: "Insufficient Cover Letter Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { companyName, jobTitle, jobDescription, resumeText } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Role: Expert Career Coach & Professional Copywriter.
      Task: Write a highly persuasive, human-sounding cover letter.
      
      Target Company: ${companyName}
      Target Role: ${jobTitle}
      Job Requirements: "${jobDescription.slice(0, 1000)}..."
      
      Candidate's Resume Context: "${resumeText.slice(0, 2000)}..."
      
      Instructions:
      1. HOOK: Start with a strong opening that mentions the company specifically.
      2. STORY: Don't just list skills. Pick 2-3 key achievements from the resume that prove the candidate can solve the job's problems.
      3. TONE: Professional, enthusiastic, and confident. Be direct.
      4. FORMAT: Return the response in clean HTML format (using <p>, <br>, <strong> tags) so it renders perfectly in an editor. Do NOT use <html> or <body> tags, just the content. Do NOT use markdown blocks.
    `;

    const result = await model.generateContent(prompt);
    const cleanContent = result.response.text().replace(/```html|```/g, "").trim();

    // 3. Save & Deduct
    const letter = await db.coverLetter.create({
      data: {
        userId: user.clerkUserId,
        jobTitle, companyName, jobDescription,
        generatedContent: cleanContent, 
        status: "completed"
      }
    });

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: { coverLetterCredits: { decrement: 1 } }
    });

    revalidatePath("/dashboard/cover-letter");
    return { success: true, id: letter.id };

  } catch (error) {
    return { success: false, error: error.message };
  }
}