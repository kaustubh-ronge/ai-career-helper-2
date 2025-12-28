import Link from "next/link";
import { Play, Sparkles, Calendar, Briefcase } from "lucide-react";

export const InterviewList = ({ interviews }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="group relative p-5 bg-[#0F121C] border border-white/10 rounded-2xl shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col"
        >
          {/* Subtle Gradient Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

          {/* Header Section */}
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
               <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                 {interview.jobPosition || "Untitled Interview"}
               </h3>
               <div className="flex items-center gap-2 mt-1">
                 <Briefcase className="w-3 h-3 text-slate-500" />
                 <span className="text-xs text-slate-400">
                   {interview.jobExperience} Years Exp
                 </span>
               </div>
            </div>
            
            {/* Date Badge */}
            <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-slate-400 font-mono flex items-center gap-1">
               <Calendar className="w-3 h-3" />
               {new Date(interview.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Description Body */}
          <div className="relative z-10 mb-6 flex-1">
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
              {interview.jobDesc}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex gap-3 mt-auto">
             {/* Feedback Button */}
             <Link
               href={`/dashboard/interview/${interview.id}/feedback`}
               className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium text-center hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
             >
               <Sparkles className="w-4 h-4 text-purple-400" /> Feedback
             </Link>

             {/* Start Button */}
             <Link
               href={`/dashboard/interview/${interview.id}/start`}
               className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold text-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group/btn"
             >
               Start <Play className="w-3 h-3 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
             </Link>
          </div>

        </div>
      ))}
    </div>
  );
};