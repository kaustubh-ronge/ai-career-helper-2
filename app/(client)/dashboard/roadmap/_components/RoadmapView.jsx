"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const RoadmapView = ({ roadmap, phases }) => {
  
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <Link href="/dashboard/roadmap">
             <Button variant="ghost" className="text-slate-400 hover:text-white gap-2 pl-0">
               <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
             </Button>
          </Link>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
             AI Powered 
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mb-4">
            {roadmap.targetRole}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Your personalized path from <span className="text-white font-medium">Current Skills</span> to <span className="text-white font-medium">Mastery</span>.
          </p>
        </motion.div>

        {/* --- TIMELINE --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative border-l-2 border-white/10 ml-4 md:ml-10 space-y-12"
        >
          {/* Start Point */}
          <div className="absolute -left-[11px] top-0 w-6 h-6 rounded-full bg-[#050505] border-4 border-slate-600" />
          
          {phases.map((phase, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="relative pl-8 md:pl-12 group"
            >
              
              {/* Timeline Dot (Glows on Hover) */}
              <div className="absolute -left-[11px] top-6 w-6 h-6 rounded-full bg-[#050505] border-4 border-emerald-500 shadow-[0_0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_2px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-300 z-10" />

              {/* Phase Card */}
              <div className="bg-[#0F121C] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden">
                 
                 {/* Card Background Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                 <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
                        <div>
                          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Phase 0{index + 1}</div>
                          <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {phase.phaseTitle}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 text-sm font-medium">
                           <Clock className="w-4 h-4" /> {phase.duration}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Topics */}
                        <div>
                          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-cyan-400" /> Key Topics
                          </h3>
                          <ul className="space-y-3">
                            {phase.topics?.map((topic, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-400 group/item">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 group-hover/item:bg-cyan-400 transition-colors" />
                                  <span className="group-hover/item:text-slate-300 transition-colors">{topic}</span>
                               </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div>
                           <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Flag className="w-4 h-4 text-emerald-400" /> Action Items
                           </h3>
                           <div className="space-y-3">
                             {phase.actions?.map((action, i) => (
                               <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all cursor-default">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                                  <span className="text-sm text-slate-300">{action}</span>
                               </div>
                             ))}
                           </div>
                        </div>

                    </div>
                 </div>

              </div>
            </motion.div>
          ))}

          {/* End Node */}
          <motion.div variants={itemVariants} className="relative pl-8 md:pl-12 pt-8">
             <div className="absolute -left-[11px] top-8 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 animate-pulse" />
             <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center gap-3 text-lg shadow-lg">
                <CheckCircle2 className="w-6 h-6" /> Goal Achieved: {roadmap.targetRole}
             </div>
          </motion.div>

        </motion.div>
    </div>
  );
};