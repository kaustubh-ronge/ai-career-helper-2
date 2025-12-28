"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// --- HELPER: ROBUST JSON CLEANER ---
// Ensures we extract ONLY the JSON object, ignoring any intro/outro text.
const cleanAIResponse = (text) => {
  // 1. Remove markdown code blocks
  let clean = text.replace(/```(?:json)?|```/g, "");
  
  // 2. Find the start "{" and end "}" of the JSON object
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  
  // 3. Extract strictly the JSON part
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  
  return clean.trim();
};

export async function generateRoadmap(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits (Correct Field: roadmapCredits)
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    
    // Safety check for credits
    if ((dbUser.roadmapCredits || 0) <= 0) {
        return { success: false, error: "Insufficient Roadmap Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { targetRole, currentSkills } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // STRICTLY using 2.5 Flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- YOUR EXACT PROMPT (UNCHANGED) ---
    const prompt = `
      Role: Expert Career Counselor & Technical Lead.
      Task: Create a step-by-step learning roadmap to go from "${currentSkills}" to "${targetRole}".
      
      Requirements:
      1. Break it down into 4-6 Logical Phases (e.g., "Foundations", "Advanced Concepts", "Projects", "Job Prep").
      2. For each phase, provide:
         - Phase Title
         - Duration (e.g., "2 Weeks")
         - List of Topics to learn (array of strings)
         - List of Actionable Items (projects to build or specific things to practice).
      
      IMPORTANT FORMATTING RULES:
      1. Output ONLY a valid JSON object.
      2. Do NOT use Markdown code blocks (like \`\`\`json).
      3. Do NOT add any conversational text.
      
      REQUIRED JSON STRUCTURE:
      {
        "phases": [
          {
            "phaseTitle": "Phase 1: Foundations",
            "duration": "2 Weeks",
            "topics": ["Topic A", "Topic B"],
            "actions": ["Build X", "Practice Y"]
          }
        ]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // 3. Apply Robust Cleaning
    const cleanJson = cleanAIResponse(rawText);
    
    // 4. Validate JSON (Catches errors before DB save)
    try {
        JSON.parse(cleanJson);
    } catch (e) {
        throw new Error("AI generated invalid data format. Please try again.");
    }

    // 5. Save to DB
    const roadmap = await db.roadmap.create({
      data: {
        userId: user.clerkUserId,
        targetRole, 
        currentSkills,
        roadmapContent: cleanJson, 
        status: "active"
      }
    });

    // 6. Deduct Credit (Correct Field: roadmapCredits)
    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: { roadmapCredits: { decrement: 1 } }
    });

    revalidatePath("/dashboard/roadmap");
    return { success: true, id: roadmap.id };

  } catch (error) {
    console.error("Error generating roadmap:", error);
    return { success: false, error: error.message || "Failed to generate roadmap" };
  }
}