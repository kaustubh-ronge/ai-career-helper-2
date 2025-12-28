import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { SetupInterview } from "./_components/SetupInterview";
import { InterviewList } from "./_components/InterviewList"; // We'll create this to keep page clean
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Assuming Shadcn or we make a simple one
import { Plus } from "lucide-react";
import { SetupInterviewModalWrapper } from "./_components/SetupInterviewModalWrapper";

export default async function InterviewDashboard() {
  const user = await checkUser();

  const interviews = await db.mockInterview.findMany({
    where: { userId: user.clerkUserId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#050505] pt-25 relative overflow-hidden">
       {/* Bg Gradient */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#050505_40%)] pointer-events-none" />

       <div className="container mx-auto px-6 py-12 relative z-10">
         
         <div className="mb-10">
           <h1 className="text-4xl font-bold text-white mb-2">Interview Simulator</h1>
           <p className="text-slate-400">Practice with AI. Get hired.</p>
         </div>

         {interviews.length === 0 ? (
           // --- SCENARIO A: NO INTERVIEWS (Show Form Directly) ---
           <div className="max-w-3xl mx-auto">
              <SetupInterview />
           </div>
         ) : (
           // --- SCENARIO B: HAS INTERVIEWS (Show Grid + Modal Trigger) ---
           <div className="space-y-6">
             
             {/* Action Bar */}
             <div className="flex justify-between items-center">
               <h2 className="text-xl font-semibold text-white">Previous Sessions</h2>
               
               {/* Modal Trigger for New Interview */}
               <SetupInterviewModalWrapper>
                 <button className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                   <Plus className="w-5 h-5" /> Create New
                 </button>
               </SetupInterviewModalWrapper>
             </div>

             {/* Grid of Cards */}
             <InterviewList interviews={interviews} />
           </div>
         )}
       </div>
    </div>
  );
}