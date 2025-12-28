"use client";
import React, { useState } from "react";
import { QuestionsSection } from "./QuestionsSection";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// 1. Dynamic Import with SSR disabled
// This forces Next.js to only load this component in the browser
const RecordAnswer = dynamic(
  () => import("./RecordAnswer").then((mod) => mod.RecordAnswer),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full bg-white/5 rounded-3xl border border-white/10">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400">Loading Recorder...</p>
      </div>
    )
  }
);

export const StartInterviewContainer = ({ mockInterviewQuestions, interviewId }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Pass state down to sidebar */}
      <QuestionsSection 
        questions={mockInterviewQuestions}
        activeIndex={activeQuestionIndex}
        setActiveIndex={setActiveQuestionIndex}
      />

      {/* Pass state down to recorder (Now safely loaded only on client) */}
      <RecordAnswer 
        questions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
        interviewId={interviewId}
        setActiveQuestionIndex={setActiveQuestionIndex}
      />
    </div>
  );
};