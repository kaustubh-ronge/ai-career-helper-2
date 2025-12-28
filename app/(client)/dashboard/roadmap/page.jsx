import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadmapList } from "./_components/RoadmapList";

export default async function RoadmapDashboard() {
  const user = await checkUser();

  const roadmaps = await db.roadmap.findMany({
    where: { userId: user.clerkUserId },
    orderBy: { createdAt: "desc" }
  });

  return (
    // Added a slow pulse animation to the container colors
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white px-6 py-30 transition-colors duration-1000 ease-in-out">
       
       {/* --- ADVANCED BACKGROUND --- */}
       {/* 1. Base dark gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080c14] to-[#050505] pointer-events-none" />
       
       {/* 2. Subtle Grid Texture */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

       {/* 3. Glowing "Nebula" Effects (CSS Animated) */}
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDuration: '8s' }} />
       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDuration: '12s' }} />
       {/* --------------------------- */}


       <div className="max-w-7xl mx-auto relative z-10">
         
         {/* Header Section */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 inline-block">
                Learning Roadmaps
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                Structure your career journey. Turn your target role into a step-by-step actionable plan tailored just for you.
              </p>
            </div>
            <Link href="/dashboard/roadmap/create">
               <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-500/20 h-12 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                 <Plus className="w-5 h-5" /> Create New Path
               </Button>
            </Link>
         </div>

         {/* Content State */}
         {roadmaps.length === 0 ? (
            
            // --- IMPROVED EMPTY STATE ---
            <div className="relative max-w-2xl mx-auto mt-12 p-1 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-white/5 to-cyan-500/20">
               <div className="text-center py-20 px-6 bg-[#0F121C]/90 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                  
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent pointer-events-none" />

                  {/* Glowing Icon */}
                  <div className="relative w-24 h-24 mx-auto mb-8 group">
                     <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all animate-pulse" />
                     <div className="relative w-full h-full bg-[#0a0e17] border border-emerald-500/30 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                       <Map className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                     </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                     No Roadmaps Yet
                  </h3>
                  <p className="text-slate-400 mb-10 max-w-md mx-auto text-base leading-relaxed">
                    Your journey hasn't started. Define your current skills and your target role, and let AI architect your personalized path to success.
                  </p>
                  
                  <Link href="/dashboard/roadmap/create">
                    <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 h-14 px-10 rounded-xl font-bold shadow-xl shadow-emerald-900/20 flex items-center gap-2 group">
                       <Sparkles className="w-5 h-5" /> Generate My First Roadmap
                    </Button>
                  </Link>
               </div>
            </div>
            // ---------------------------

         ) : (
            // The list component presumably handles its own item animations
            <RoadmapList roadmaps={roadmaps} />
         )}

       </div>
    </div>
  );
}