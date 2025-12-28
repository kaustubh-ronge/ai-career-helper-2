"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code2, 
  Layers, 
  Zap, 
  ArrowRight, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import { generateInterviewQuestions } from "@/actions/generate-interview";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SetupInterview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
    techStack: "",
    difficulty: 5,
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.jobPosition || !formData.jobDesc || !formData.techStack) {
      return toast.error("Please fill in all required fields.");
    }
    
    setLoading(true);
    
    // Pass formData directly now, since it matches what the action expects
    // We just ensure 'difficulty' is part of it (which it is in state)
    const result = await generateInterviewQuestions(formData);

    if (result.success) {
      toast.success("Interview Room Ready!");
      router.push(`/dashboard/interview/${result.id}/start`);
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full py-10">
      
      {/* --- HERO BACKGROUND ELEMENTS (Local to this component) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative bg-[#0F121C]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <Sparkles className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-white">Interview Configuration</h2>
                 <p className="text-xs text-slate-400">Define your target role for the AI</p>
               </div>
             </div>
             <div className="px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-medium flex items-center gap-1">
               <Zap className="w-3 h-3" />
               AI Powered
             </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Job Role */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-300 ml-1 group-focus-within:text-blue-400 transition-colors">
                  Target Job Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    value={formData.jobPosition}
                    onChange={(e) => setFormData({...formData, jobPosition: e.target.value})}
                  />
                </div>
              </div>

              {/* Field 2: Tech Stack */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-300 ml-1 group-focus-within:text-purple-400 transition-colors">
                  Tech Stack / Skills
                </label>
                <div className="relative">
                  <Code2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, AWS, PostgreSQL"
                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                    value={formData.techStack}
                    onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                  />
                </div>
              </div>

            </div>

            {/* Field 3: Years of Experience */}
            <div className="space-y-2 group">
               <label className="text-sm font-medium text-slate-300 ml-1 group-focus-within:text-green-400 transition-colors">
                 Years of Experience
               </label>
               <div className="relative">
                 <Layers className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                 <input
                   type="number"
                   placeholder="e.g. 5"
                   className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all"
                   value={formData.jobExperience}
                   onChange={(e) => setFormData({...formData, jobExperience: e.target.value})}
                 />
               </div>
            </div>

            {/* Field 4: Job Description */}
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 group-focus-within:text-white transition-colors">
                Job Description (Paste snippet)
              </label>
              <textarea
                placeholder="Paste key requirements here to help AI tailor questions..."
                className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none transition-all"
                value={formData.jobDesc}
                onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
              />
            </div>

            {/* Slider: Difficulty */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
               <div className="flex justify-between mb-4">
                 <span className="text-sm font-medium text-slate-300">Ruthlessness Level</span>
                 <span className="text-sm font-bold text-amber-400">{formData.difficulty}/10</span>
               </div>
               <input 
                 type="range" 
                 min="1" 
                 max="10" 
                 value={formData.difficulty}
                 onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                 className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
               />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating Session...
                </>
              ) : (
                <>
                  Start AI Interview <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};