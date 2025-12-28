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
    
    // Handle potential field naming differences in your schema
    const credits = dbUser.creditsCoverLetter ?? dbUser.coverLetterCredits ?? 0;
    
    if (credits <= 0) {
        return { success: false, error: "Insufficient Cover Letter Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { companyName, jobTitle, jobDescription, resumeText } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use stable model
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
      
      IMPORTANT FORMATTING RULES:
      1. Return ONLY the raw HTML content.
      2. Use standard tags: <p>, <br>, <strong> for emphasis.
      3. Do NOT use <html>, <head>, or <body> tags.
      4. Do NOT use Markdown code blocks (like \`\`\`html).
      5. Do NOT add any conversational text (e.g., "Here is your letter").
      6. Ensure there are proper line breaks between paragraphs.
    `;

    const result = await model.generateContent(prompt);
    
    // Clean up potential markdown or wrapper text
    const cleanContent = result.response.text()
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();

    // 3. Save & Deduct
    const letter = await db.coverLetter.create({
      data: {
        userId: user.clerkUserId,
        jobTitle, 
        companyName, 
        jobDescription,
        generatedContent: cleanContent, 
        status: "completed"
      }
    });

    // Determine correct field name for decrement
    const updateData = dbUser.creditsCoverLetter !== undefined 
        ? { creditsCoverLetter: { decrement: 1 } }
        : { coverLetterCredits: { decrement: 1 } };

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: updateData
    });

    revalidatePath("/dashboard/cover-letter");
    return { success: true, id: letter.id };

  } catch (error) {
    console.error("Error generating cover letter:", error);
    return { success: false, error: error.message || "Failed to generate cover letter" };
  }
}