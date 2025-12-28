"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";

export const InterviewChart = ({ mockInterviews }) => {
  // If no data, showing a dummy placeholder or empty state
  const data = mockInterviews && mockInterviews.length > 0 
    ? mockInterviews.map((item, index) => ({
        name: `Attempt ${index + 1}`,
        score: item.averageScore || 0, // Assuming you calculate an avg score per interview
        date: new Date(item.createdAt).toLocaleDateString()
      }))
    : [
        { name: "Mon", score: 40 },
        { name: "Tue", score: 60 },
        { name: "Wed", score: 75 },
        { name: "Thu", score: 85 },
      ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-[#111827] border border-white/10 shadow-lg h-full"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Interview Performance</h2>
        <p className="text-sm text-slate-400">Your average score trend over time</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#8b5cf6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#fff" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};