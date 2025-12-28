"use client";
import React, { useState } from "react";
import { generateRoadmap } from "@/actions/generate-roadmap";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles, Target, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export const RoadmapGenerator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: "",
    currentSkills: ""
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!formData.targetRole || !formData.currentSkills) return toast.error("Please fill all fields");

    setLoading(true);
    const result = await generateRoadmap(formData);

    if (result.success) {
      toast.success("Roadmap Generated!");
      router.push(`/dashboard/roadmap/${result.id}`);
    } else {
      toast.error("Error: " + result.error);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto relative"
    >
      {/* Ambient Glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px]" />

      <div className="bg-[#0F121C] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden">
        
        <div className="mb-10 text-center space-y-2">
           <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/5">
             <Sparkles className="w-6 h-6 text-emerald-400" />
           </div>
           <h1 className="text-3xl font-bold text-white">Career Roadmap Studio</h1>
           <p className="text-slate-400">Define your goal. AI will architect your path.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
           
           <div className="space-y-3 group">
             <label className="text-sm font-medium text-slate-300 flex items-center gap-2 group-focus-within:text-emerald-400 transition-colors">
               <Target className="w-4 h-4" /> Target Role
             </label>
             <Input 
               value={formData.targetRole}
               onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
               placeholder="e.g. Senior Full Stack Engineer"
               className="bg-black/40 border-white/10 text-white focus:border-emerald-500/50 h-12 rounded-xl transition-all"
             />
           </div>

           <div className="space-y-3 group">
             <label className="text-sm font-medium text-slate-300 flex items-center gap-2 group-focus-within:text-cyan-400 transition-colors">
               <Zap className="w-4 h-4" /> Current Skills / Experience
             </label>
             <Textarea 
               value={formData.currentSkills}
               onChange={(e) => setFormData({...formData, currentSkills: e.target.value})}
               placeholder="e.g. I know React basics, Tailwind, and some Python. I have 1 year experience..."
               className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50 min-h-[120px] rounded-xl resize-none transition-all"
             />
           </div>

           <Button 
             disabled={loading}
             className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
           >
             {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Architecting Path...</>
             ) : (
                <>Generate Roadmap <ChevronRight className="w-5 h-5 ml-2" /></>
             )}
           </Button>

        </form>
      </div>
    </motion.div>
  );
};