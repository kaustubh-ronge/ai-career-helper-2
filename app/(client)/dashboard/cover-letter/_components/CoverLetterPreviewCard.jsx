import Link from "next/link";
import { FileText, Calendar, ArrowRight, Eye } from "lucide-react";

export const CoverLetterPreviewCard = ({ letter }) => {
  return (
    <div className="group relative w-full p-6 bg-[#0F121C] border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      
      {/* Icon & Title Group */}
      <div className="flex items-start gap-4 flex-1">
        <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
          <FileText className="w-7 h-7" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {letter.jobTitle}
          </h3>
          <p className="text-slate-400 font-medium">
             at <span className="text-slate-300">{letter.companyName}</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
             <Calendar className="w-3 h-3" />
             Created: {new Date(letter.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Snippet / Preview (Hidden on small screens) */}
      <div className="hidden lg:block flex-1 px-6 border-l border-white/5">
        <p className="text-sm text-slate-500 italic line-clamp-2 leading-relaxed">
          {/* Regex to strip HTML tags for plain text preview */}
          "{letter.generatedContent?.replace(/<[^>]*>?/gm, '').substring(0, 150)}..."
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
         <Link href={`/dashboard/cover-letter/${letter.id}`}>
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all group-hover:border-white/20">
             <Eye className="w-4 h-4" /> View
           </button>
         </Link>
         
         <Link href={`/dashboard/cover-letter/${letter.id}`}>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all">
              Open <ArrowRight className="w-4 h-4" />
            </button>
         </Link>
      </div>

    </div>
  );
};