"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

// --- HELPER: ROBUST JSON CLEANER ---
// This ensures we extract ONLY the JSON array, ignoring any intro/outro text.
const cleanAIResponse = (text) => {
  // 1. Remove markdown code blocks
  let clean = text.replace(/```(?:json)?|```/g, "");
  
  // 2. Find the start "[" and end "]" of the JSON array
  const firstBracket = clean.indexOf("[");
  const lastBracket = clean.lastIndexOf("]");
  
  // 3. Extract strictly the JSON part
  if (firstBracket !== -1 && lastBracket !== -1) {
    clean = clean.substring(firstBracket, lastBracket + 1);
  }
  
  return clean.trim();
};

export async function generateInterviewQuestions(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits (Correct Field: interviewCredits)
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    
    // Safety check for credits
    if ((dbUser.interviewCredits || 0) <= 0) {
        return { success: false, error: "Insufficient Interview Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { jobPosition, jobDesc, jobExperience, techStack, difficulty } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // STRICTLY using 2.5 Flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- YOUR EXACT PROMPT (UNCHANGED) ---
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
    const rawText = result.response.text();

    // 3. Apply Robust Cleaning
    const cleanJson = cleanAIResponse(rawText);

    // 4. Validate JSON (Catches errors before DB save)
    JSON.parse(cleanJson); 

    // 5. Save to DB
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

    // 6. Deduct Credit (Correct Field: interviewCredits)
    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: { interviewCredits: { decrement: 1 } } 
    });

    revalidatePath("/dashboard/interview");
    return { success: true, id: mockInterview.id };

  } catch (error) {
    console.error("Error generating interview:", error);
    // Return a clean error message to the frontend
    return { success: false, error: error.message || "Failed to generate questions. Please try again." };
  }
}