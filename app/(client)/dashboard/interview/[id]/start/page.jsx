import React from "react";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { StartInterviewContainer } from "./_components/StartInterviewContainer";

export default async function StartInterviewPage({ params }) {
  // 1. Await params (REQUIRED in Next.js 15)
  const resolvedParams = await params;
  const interviewId = resolvedParams.id;

  // 2. Auth Check
  const user = await checkUser();
  if (!user) return redirect("/sign-in");

  // 3. Fetch Interview Data
  const interview = await db.mockInterview.findUnique({
    where: { 
      id: interviewId,
      userId: user.clerkUserId 
    }
  });

  if (!interview) {
    return redirect("/dashboard/interview");
  }

  const mockInterviewQuestions = JSON.parse(interview.jsonMockResp);

  return (
    <div className="min-h-screen pb-20 bg-[#050505] text-white pt-30 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
               {interview.jobPosition}
             </h1>
             <p className="text-slate-400 text-sm mt-1">
                Difficulty: {interview.jobExperience}/10
             </p>
           </div>
           
           {/* You can add logic here to mark as completed later */}
           <div className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
             Active Session
           </div>
        </div>

        {/* The Client Container Handles State */}
        <StartInterviewContainer 
          mockInterviewQuestions={mockInterviewQuestions}
          interviewId={interview.id}
        />
        
      </div>
    </div>
  );
}