"use client";
import React, { useState } from "react";
import { generateCoverLetter } from "@/actions/generate-cover-letter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles, Briefcase, User, PenTool } from "lucide-react";

export const CoverLetterGenerator = ({ onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    resumeText: "" 
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await generateCoverLetter(formData);

    if (result.success) {
      toast.success("Cover Letter Generated!");
      setLoading(false);
      // If used in modal, close it
      if (onSuccess) onSuccess(); 
      router.push(`/dashboard/cover-letter/${result.id}`);
      router.refresh();
    } else {
      toast.error("Error: " + result.error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-[#0F121C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

        <div className="p-8">
           <div className="mb-8 flex items-center gap-3">
             <div className="p-3 bg-pink-500/10 rounded-xl">
               <PenTool className="w-6 h-6 text-pink-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white">Generate Cover Letter</h2>
               <p className="text-slate-400 text-sm">AI Storytelling Mode</p>
             </div>
           </div>

           <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: Target Job */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Target Role
              </h3>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400">Job Title</label>
                   <input 
                     required
                     className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                     placeholder="e.g. Product Manager"
                     onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400">Company</label>
                   <input 
                     required
                     className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                     placeholder="e.g. Netflix"
                     onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                   />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Job Description (Snippet)</label>
                <textarea 
                  required
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-600"
                  placeholder="Paste key responsibilities & requirements here..."
                  onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                />
              </div>
            </div>

            {/* RIGHT: User Context */}
            <div className="space-y-5 flex flex-col">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-pink-400" /> Your Experience
              </h3>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-medium text-slate-400">Resume / Skills Summary</label>
                <textarea 
                  required
                  className="w-full flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-pink-500 outline-none resize-none min-h-[150px] transition-all placeholder:text-slate-600"
                  placeholder="Tell AI about your skills, past roles, or paste your resume summary..."
                  onChange={(e) => setFormData({...formData, resumeText: e.target.value})}
                />
              </div>
            </div>

            {/* Submit Button (Full Width) */}
            <div className="lg:col-span-2 pt-4">
               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {loading ? (
                   <> <Loader2 className="w-5 h-5 animate-spin" /> Crafting Story... </>
                 ) : (
                   <> <Sparkles className="w-5 h-5" /> Generate Cover Letter </>
                 )}
               </button>
            </div>

           </form>
        </div>
      </div>
    </div>
  );
};