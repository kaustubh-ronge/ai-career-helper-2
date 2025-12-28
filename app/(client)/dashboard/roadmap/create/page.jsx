import React from "react";
import { RoadmapGenerator } from "../_components/RoadmapGenerator";

export default function CreateRoadmapPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-30">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#050505] to-[#050505] pointer-events-none" />
      <RoadmapGenerator />
    </div>
  );
}