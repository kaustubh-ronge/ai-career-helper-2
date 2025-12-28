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
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.clerkUserId } });
    if (dbUser.roadmapCredits <= 0) {
        return { success: false, error: "Insufficient Roadmap Credits. Please upgrade." };
    }

    // 2. Gemini Logic
    const { targetRole, currentSkills } = data;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Role: Expert Career Counselor & Technical Lead.
      Task: Create a step-by-step learning roadmap to go from "${currentSkills}" to "${targetRole}".
      
      Requirements:
      1. Break it down into 4-6 Logical Phases (e.g., "Foundations", "Advanced Concepts", "Projects", "Job Prep").
      2. For each phase, provide:
         - Phase Title
         - Duration (e.g., "2 Weeks")
         - List of Topics to learn
         - List of Actionable Items (projects to build or specific things to practice).
      
      Output Format: Return ONLY a valid JSON object. Do not use Markdown blocks. Structure:
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
    const cleanJson = result.response.text().replace(/```(?:json)?|```/g, "").trim();
    
    // 3. Save & Deduct
    const roadmap = await db.roadmap.create({
      data: {
        userId: user.clerkUserId,
        targetRole, currentSkills,
        roadmapContent: cleanJson, 
        status: "active"
      }
    });

    await db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: { roadmapCredits: { decrement: 1 } }
    });

    revalidatePath("/dashboard/roadmap");
    return { success: true, id: roadmap.id };

  } catch (error) {
    return { success: false, error: error.message };
  }
}