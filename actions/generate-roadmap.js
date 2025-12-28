"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

export async function generateRoadmap(data) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User authentication failed.");

    // 1. Check Credits
    // Verify the field name in your Prisma schema (e.g., roadmapCredits vs creditsRoadmap)
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    
    // Check if the user has credits (handle naming variations)
    const credits = dbUser.creditsRoadmap ?? dbUser.roadmapCredits ?? 0;
    if (credits <= 0) {
        return { success: false, error: "Insufficient Roadmap Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { targetRole, currentSkills } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use a stable model version
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    
    // Clean up potential markdown from AI response
    const cleanJson = result.response.text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    
    // VALIDATION STEP: Verify it is valid JSON before saving
    // This protects your frontend from crashing later
    try {
        JSON.parse(cleanJson);
    } catch (e) {
        throw new Error("AI generated invalid data format. Please try again.");
    }

    // 3. Save & Deduct
    const roadmap = await db.roadmap.create({
      data: {
        userId: user.clerkUserId,
        targetRole, 
        currentSkills,
        roadmapContent: cleanJson, 
        status: "active"
      }
    });

    // Determine correct field name for decrement
    // NOTE: Check your schema.prisma to be sure if it's 'roadmapCredits' or 'creditsRoadmap'
    const updateData = dbUser.creditsRoadmap !== undefined 
        ? { creditsRoadmap: { decrement: 1 } }
        : { roadmapCredits: { decrement: 1 } };

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: updateData
    });

    revalidatePath("/dashboard/roadmap");
    return { success: true, id: roadmap.id };

  } catch (error) {
    console.error("Error generating roadmap:", error);
    return { success: false, error: error.message || "Failed to generate roadmap" };
  }
}