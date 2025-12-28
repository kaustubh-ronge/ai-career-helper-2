"use client";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle, Webcam as WebcamIcon, ArrowRight, ArrowLeft, CheckCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { saveUserAnswer } from "@/actions/save-answer";
import { useRouter } from "next/navigation";

export const RecordAnswer = ({ questions, activeQuestionIndex, interviewId, setActiveQuestionIndex }) => {
  const router = useRouter();
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Track which questions have been answered to know what to backfill
  const [answeredIndices, setAnsweredIndices] = useState(new Set());

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => setUserAnswer((prev) => prev + result.transcript));
  }, [results]);

  useEffect(() => {
    setUserAnswer("");
    setResults([]);
  }, [activeQuestionIndex]);

  // --- SAVE CURRENT ANSWER ---
  const saveCurrentAnswer = async () => {
    if (userAnswer.length < 5) {
      toast.error("Answer is too short. Please speak more.");
      return false;
    }
    setLoading(true);
    
    const activeQ = questions[activeQuestionIndex];
    const result = await saveUserAnswer({
      mockIdRef: interviewId,
      question: activeQ.question,
      correctAnswer: activeQ.answer,
      userAnswer: userAnswer,
    });

    if (result.success) {
      toast.success("Answer Saved!");
      setAnsweredIndices(prev => new Set(prev).add(activeQuestionIndex));
      setLoading(false);
      return true;
    } else {
      toast.error("Error: " + result.error);
      setLoading(false);
      return false;
    }
  };

  // --- BACKFILL SKIPPED QUESTIONS ---
  const fillUnansweredQuestions = async () => {
    const promises = questions.map(async (q, index) => {
      // If NOT currently answering AND NOT previously answered
      if (index !== activeQuestionIndex && !answeredIndices.has(index)) {
        return saveUserAnswer({
          mockIdRef: interviewId,
          question: q.question,
          correctAnswer: q.answer,
          userAnswer: "Skipped", // Mark as skipped
        });
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
  };

  // --- MAIN HANDLER ---
  const handleNextOrSubmit = async () => {
    // 1. Save the current answer first
    const saved = await saveCurrentAnswer();
    if (!saved) return; // Stop if save failed or too short

    // 2. Decide: Next Question OR Finish
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      // LAST QUESTION: Finish
      await finishInterview();
    }
  };

  const finishInterview = async () => {
    setLoading(true);
    toast.info("Finalizing Results...");
    
    // Auto-skip any questions the user jumped over
    await fillUnansweredQuestions();
    
    toast.success("Interview Completed!");
    router.push(`/dashboard/interview/${interviewId}/feedback`);
  };

  const isLastQuestion = activeQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Webcam Section (Unchanged) */}
      <div className="relative w-full aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
        <WebcamIcon className="absolute w-20 h-20 text-slate-800" />
        <Webcam mirrored={true} style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 10 }} />
        {isRecording && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-xs text-red-200 font-medium">REC</span>
          </div>
        )}
      </div>

      <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 min-h-[100px]">
        <h3 className="text-xs text-slate-400 mb-2 font-bold uppercase">Your Answer:</h3>
        <p className="text-sm text-slate-200">
           {userAnswer || (isRecording ? "Listening..." : "Click record to start speaking...")}
        </p>
      </div>

      <div className="flex items-center justify-between w-full gap-4">
        {/* Prev Button */}
        <button
           disabled={activeQuestionIndex === 0 || loading}
           onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
           className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Record Button */}
        <div className="flex-1">
          {isRecording ? (
            <button 
              onClick={stopSpeechToText}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/20"
            >
              <StopCircle /> Stop
            </button>
          ) : (
            <button 
              disabled={loading}
              onClick={startSpeechToText}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Mic /> Record
            </button>
          )}
        </div>

        {/* Dynamic Next/Submit Button */}
        <button 
          disabled={loading || (!isRecording && userAnswer.length < 5)}
          onClick={handleNextOrSubmit}
          className={`px-6 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isLastQuestion 
              ? "bg-green-600 hover:bg-green-700 shadow-green-500/20 text-white" 
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 text-white"
          }`}
        >
          {loading ? "Saving..." : (
             isLastQuestion ? <>Submit <CheckCircle className="w-5 h-5"/></> : <>Next <ArrowRight className="w-5 h-5"/></>
          )}
        </button>
      </div>
    </div>
  );
};