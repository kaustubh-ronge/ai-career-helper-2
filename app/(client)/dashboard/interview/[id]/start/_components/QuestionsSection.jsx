"use client";
import React, { useState, useEffect } from "react";
import { Lightbulb, Volume2 } from "lucide-react";

export const QuestionsSection = ({ questions, activeIndex, setActiveIndex }) => {
  
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="p-6 border border-white/10 rounded-3xl bg-[#111827] h-full flex flex-col justify-between">
      
      {/* Question Bubbles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {questions && questions.map((q, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex && setActiveIndex(index)}
            className={`p-2 rounded-full text-xs font-bold text-center cursor-pointer transition-all ${
              activeIndex === index 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            Question #{index + 1}
          </div>
        ))}
      </div>

      {/* Active Question Card */}
      <div className="mt-8 p-6 bg-black/40 rounded-2xl border border-white/5 relative group">
        <Volume2 
          className="absolute top-4 right-4 w-5 h-5 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors"
          onClick={() => textToSpeech(questions[activeIndex]?.question)}
        />
        <h2 className="text-sm text-blue-400 font-bold tracking-widest uppercase mb-3">
          Current Question
        </h2>
        <p className="text-lg text-slate-200 leading-relaxed">
          {questions[activeIndex]?.question}
        </p>
      </div>

      {/* Hint Box */}
      <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4 items-start">
        <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
        <div className="text-sm text-blue-200/80">
          <strong>Tip:</strong> Click "Record Answer" when ready. Speak clearly and try to use technical keywords related to the job description.
        </div>
      </div>
    </div>
  );
};