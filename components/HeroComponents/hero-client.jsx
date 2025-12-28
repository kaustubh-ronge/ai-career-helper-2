"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, ScanLine, FileText, BrainCircuit } from "lucide-react";

export const HeroClient = () => {
  const containerRef = useRef(null);
  
  // Parallax Effect Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yGraphics = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-full pt-32 pb-20 px-4 md:px-6 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
      
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {/* Purple Blob */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]"
        />
        {/* Blue Blob */}
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] z-0" style={{ backgroundSize: "40px 40px" }} />
      </div>


      {/* --- LEFT SIDE: TEXT CONTENT --- */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-10 w-full px-10 lg:w-1/2 space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-slate-300">AI-Powered Career Excellence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
        >
          Build a Career <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
            That Defies Limits
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-xl leading-relaxed"
        >
          The all-in-one AI platform to craft ATS-proof resumes, ace interviews with real-time feedback, and generate cover letters that get you hired.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center gap-2">
            Start Building Free <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-md">
            Watch Demo
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 flex items-center gap-8 border-t border-white/10 mt-8"
        >
          {[
            { label: "Resumes Optimized", val: "10,000+" },
            { label: "Interviews Aced", val: "5,000+" }
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>


      {/* --- RIGHT SIDE: ANIMATED 3D CARD / "AD" --- */}
      <motion.div 
        style={{ y: yGraphics, opacity }}
        className="relative z-10 w-full lg:w-1/2 h-[500px] perspective-1000 flex items-center justify-center"
      >
        {/* The Floating Glass Card */}
        <motion.div 
          initial={{ rotateX: 20, rotateY: -20, opacity: 0, scale: 0.9 }}
          animate={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative w-[380px] h-[480px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col gap-6"
        >
          {/* Decorative Header inside Card */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                 <FileText className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h4 className="text-sm font-semibold text-white">Resume_V4.pdf</h4>
                 <p className="text-xs text-green-400 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                   AI Analysis Active
                 </p>
               </div>
             </div>
             <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 font-mono">
               98% Match
             </div>
          </div>

          {/* Animated Scanning Line */}
          <div className="relative flex-1 bg-white/5 rounded-xl overflow-hidden p-4 space-y-3">
             <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
             />
             
             {/* Fake Content Skeleton */}
             <div className="h-4 w-3/4 bg-white/10 rounded" />
             <div className="h-4 w-1/2 bg-white/10 rounded" />
             <div className="h-20 w-full bg-white/5 rounded mt-4" />
             <div className="flex gap-2 mt-4">
                <div className="h-8 w-20 bg-indigo-500/20 rounded border border-indigo-500/30" />
                <div className="h-8 w-20 bg-purple-500/20 rounded border border-purple-500/30" />
             </div>
          </div>

          {/* Floating 'Success' Badge */}
          <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -right-8 bottom-12 bg-white text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
               <BrainCircuit className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500">AI Suggestion</p>
               <p className="text-sm font-bold">Skills Optimized!</p>
             </div>
          </motion.div>
        </motion.div>

        {/* Background Glow behind Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/30 blur-[100px] -z-10" />

      </motion.div>
    </div>
  );
};