"use client";
import React from "react";
import Link from "next/link";
import { Map, ArrowRight, Calendar, Target } from "lucide-react";
import { motion } from "framer-motion";

export const RoadmapList = ({ roadmaps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roadmaps.map((map, index) => (
        <motion.div
          key={map.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/dashboard/roadmap/${map.id}`}>
            <div className="group h-full p-6 bg-[#0F121C] border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col relative overflow-hidden">
               
               {/* Hover Gradient */}
               <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

               <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                       <Map className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                       <Calendar className="w-3 h-3" /> {new Date(map.createdAt).toLocaleDateString()}
                    </span>
                 </div>

                 <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                   {map.targetRole}
                 </h3>
                 
                 <div className="flex items-start gap-2 mb-6">
                    <Target className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                    <p className="text-sm text-slate-400 line-clamp-2">
                       From: {map.currentSkills}
                    </p>
                 </div>

                 <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <span>View Plan</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>

            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};