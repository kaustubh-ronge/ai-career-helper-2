"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function saveUserAnswer(data) {
  try {
    const { mockIdRef, question, userAnswer, correctAnswer } = data;

    // 1. Auth Check
    const user = await checkUser();
    if (!user) throw new Error("User not authenticated");

    // 2. AI Feedback Generation
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Question: "${question}"
      User Answer: "${userAnswer}"
      Correct Answer Context: "${correctAnswer}"
      
      Task: Rate the user's answer (0-100) and provide feedback.
      
      Strict JSON Output:
      {
        "rating": number,
        "feedback": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanJson = rawText.replace(/```(?:json)?|```/g, "").trim();
    const feedbackData = JSON.parse(cleanJson);

    // 3. Save to Database (REMOVED 'userId' to match your Schema)
    const savedRecord = await db.userAnswer.create({
      data: {
        mockIdRef: mockIdRef, 
        question: question,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        feedback: feedbackData.feedback,
        rating: feedbackData.rating,
        // userId: user.clerkUserId,  <-- REMOVED because it's not in your UserAnswer schema
      },
    });

    return { success: true, id: savedRecord.id };

  } catch (error) {
    console.error("Error saving answer:", error.message);
    return { success: false, error: error.message };
  }
}