import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { CoverLetterGenerator } from "./_components/CoverLetterGenerator";
import { CoverLetterPreviewCard } from "./_components/CoverLetterPreviewCard";
import { CoverLetterModal } from "./_components/CoverLetterModal";
import { Plus } from "lucide-react";

export default async function CoverLetterDashboard() {
  const user = await checkUser();

  const letters = await db.coverLetter.findMany({
    where: { userId: user.clerkUserId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen  bg-[#050505] relative overflow-hidden text-white py-20">
       {/* Background */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#4f46e5_0%,_#050505_50%)] pointer-events-none opacity-20" />

       <div className="container mx-auto px-6 py-12 relative z-10">
         
         {/* Header */}
         <div className="mb-10">
           <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
             Cover Letter Studio
           </h1>
           <p className="text-slate-400 mt-2 text-lg">
             Craft persuasive narratives that get you hired.
           </p>
         </div>

         {/* --- LOGIC SPLIT --- */}
         {letters.length === 0 ? (
           
           // SCENARIO A: No Letters -> Show Form Directly
           <div className="mt-12">
             <CoverLetterGenerator />
           </div>

         ) : (
           
           // SCENARIO B: Has Letters -> Show List + Modal Trigger
           <div className="space-y-8">
             
             {/* Toolbar */}
             <div className="flex justify-between items-center border-b border-white/10 pb-6">
               <h2 className="text-xl font-semibold text-slate-300">Your Drafts</h2>
               
               <CoverLetterModal>
                 <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                   <Plus className="w-5 h-5" /> Create New
                 </button>
               </CoverLetterModal>
             </div>

             {/* Full Width Cards Stack */}
             <div className="flex flex-col gap-4">
               {letters.map((letter) => (
                 <CoverLetterPreviewCard key={letter.id} letter={letter} />
               ))}
             </div>

           </div>
         )}

       </div>
    </div>
  );
}