"use client";
import React from "react";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const AddResume = () => {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push("/dashboard/resume/create")}
      className="p-6 py-12 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group h-full min-h-[200px]"
    >
      <div className="p-3 rounded-full bg-white/10 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
        <PlusSquare className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
      </div>
      <p className="text-slate-300 font-medium group-hover:text-white">Create New Resume</p>
    </motion.div>
  );
};