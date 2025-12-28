"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, Mic2, TrendingUp, AlertCircle } from "lucide-react";

export const StatsCards = ({ resumeCount, interviewCount, feedbackScore }) => {
  
  const stats = [
    {
      title: "Total Resumes",
      value: resumeCount || 0,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "ATS Optimized"
    },
    {
      title: "Interviews Taken",
      value: interviewCount || 0,
      icon: Mic2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "Practice Sessions"
    },
    {
      title: "Avg. Score",
      value: feedbackScore ? `${feedbackScore}%` : "N/A",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      desc: "Performance Rating"
    },
    {
      title: "Pending Actions",
      value: 2, // Placeholder for now
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Complete your profile"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-white">{stat.value}</h4>
            <p className="text-xs text-slate-500">{stat.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};