import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma"; // Make sure your db import path is correct
import { redirect } from "next/navigation";
import { StatsCards } from "./_components/StatsCards";
import { InterviewChart } from "./_components/InterviewChart";
import { AddResume } from "./_components/AddResume";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await checkUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch Real Data from DB
  const resumeCount = await db.resume.count({
    where: { userId: user.clerkUserId }
  });

  const mockInterviews = await db.mockInterview.findMany({
    where: { userId: user.clerkUserId },
    orderBy: { createdAt: 'desc' },
    include: { userAnswers: true } // We need answers to calc scores
  });

  // Calculate Average Score Logic (Simplified for now)
  // In a real app, you'd calculate this based on the 'rating' field in UserAnswer
  const interviewCount = mockInterviews.length;
  let totalRating = 0;
  let answerCount = 0;
  
  mockInterviews.forEach(interview => {
     interview.userAnswers.forEach(ans => {
        if(ans.rating) {
           totalRating += ans.rating;
           answerCount++;
        }
     });
  });

  const avgScore = answerCount > 0 ? Math.round(totalRating / answerCount) : 0;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-10">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Welcome back, {user.name}
            </h1>
            <p className="text-slate-400 mt-2">
              Here is your career growth overview.
            </p>
          </div>
          <Link href="/dashboard/resume" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2">
            Go to Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Area */}
        <StatsCards 
          resumeCount={resumeCount} 
          interviewCount={interviewCount}
          feedbackScore={avgScore} 
        />

        {/* Charts & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section (Takes up 2 columns) */}
          <div className="lg:col-span-2">
            <InterviewChart mockInterviews={mockInterviews} />
          </div>

          {/* Quick Action / Recent Resume (Takes up 1 column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <AddResume />
             
             {/* Simple List of Recent Resumes (Optional Mini Component) */}
             <div className="p-6 rounded-2xl bg-[#111827] border border-white/10">
               <h3 className="font-semibold mb-4">Recent Resumes</h3>
               <div className="space-y-3">
                 {/* This would ideally be a .map() of fetched resumes */}
                 <div className="p-3 bg-white/5 rounded-lg text-sm text-slate-300">
                   Software_Engineer_V1.pdf
                 </div>
                 <div className="p-3 bg-white/5 rounded-lg text-sm text-slate-300">
                   Product_Manager.pdf
                 </div>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}