import React from "react";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  Home, 
  Sparkles 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming you have shadcn accordion, if not, standard html details works too

export default async function FeedbackPage({ params }) {
  // Await params for Next.js 15
  const resolvedParams = await params;
  const interviewId = resolvedParams.id;

  const user = await checkUser();
  if (!user) return redirect("/sign-in");

  // Fetch Interview & Answers
  const interview = await db.mockInterview.findUnique({
    where: { id: interviewId, userId: user.clerkUserId },
    include: {
        userAnswers: {
            orderBy: { createdAt: 'asc' }
        }
    }
  });

  if (!interview) return redirect("/dashboard/interview");

  // Calculate Overall Score
  let totalRating = 0;
  interview.userAnswers.forEach(ans => totalRating += ans.rating || 0);
  const avgRating = Math.round(totalRating / interview.userAnswers.length) || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-bold text-green-500">
             Interview Completed!
           </h1>
           <p className="text-slate-400 text-lg">
             Here is your detailed AI feedback report.
           </p>
        </div>

        {/* Score Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-50" />
           
           <div className="relative z-10 space-y-1">
             <h2 className="text-xl font-bold text-white">Overall Performance</h2>
             <p className="text-sm text-slate-400">Based on {interview.userAnswers.length} questions</p>
           </div>

           <div className="relative z-10 flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Your Score</p>
                <p className={`text-4xl font-black ${avgRating >= 80 ? "text-green-400" : avgRating >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                   {avgRating}%
                </p>
              </div>
           </div>
        </div>

        {/* Detailed Feedback List (Accordion) */}
        <div className="space-y-4">
           <h2 className="text-lg font-bold text-white flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-blue-400" /> 
             Question Analysis
           </h2>

           {interview.userAnswers.length === 0 && (
             <p className="text-slate-500 italic">No answers recorded for this interview.</p>
           )}

           <Accordion type="single" collapsible className="w-full space-y-4">
             {interview.userAnswers.map((item, index) => (
               <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-xl bg-white/5 px-4">
                 
                 <AccordionTrigger className="hover:no-underline py-4">
                   <div className="flex items-center justify-between w-full text-left gap-4 pr-4">
                      <span className="text-sm md:text-base font-medium text-slate-200 w-[70%]">
                         Q{index + 1}. {item.question}
                      </span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                         item.rating >= 80 ? "bg-green-500/10 text-green-400 border-green-500/20" :
                         item.rating >= 50 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                         "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        Rating: {item.rating}/100
                      </div>
                   </div>
                 </AccordionTrigger>

                 <AccordionContent className="pb-4 space-y-4 pt-2">
                    {/* User Answer */}
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
                       <h3 className="font-bold text-red-400 mb-1 flex items-center gap-2">
                         <XCircle className="w-4 h-4" /> Your Answer:
                       </h3>
                       <p className="text-slate-300">{item.userAnswer}</p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                       <h3 className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                         <Sparkles className="w-4 h-4" /> AI Feedback:
                       </h3>
                       <p className="text-slate-300">{item.feedback}</p>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                       <h3 className="font-bold text-green-400 mb-1 flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4" /> Ideal Answer:
                       </h3>
                       <p className="text-slate-300">{item.correctAnswer}</p>
                    </div>
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-8">
           <Link 
             href="/dashboard/interview"
             className="px-8 py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
           >
             <Home className="w-4 h-4" /> Go Home
           </Link>
        </div>

      </div>
    </div>
  );
}