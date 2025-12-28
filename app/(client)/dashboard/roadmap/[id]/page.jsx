import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoadmapView } from "../_components/RoadmapView";

export default async function RoadmapPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const user = await checkUser();

  const roadmap = await db.roadmap.findUnique({
    where: { id: id, userId: user.clerkUserId }
  });

  if (!roadmap) return redirect("/dashboard/roadmap");

  // Safe Parsing
  let phases = [];
  try {
    const parsed = JSON.parse(roadmap.roadmapContent);
    phases = parsed.phases || [];
  } catch (e) {
    console.error("JSON Parse Error", e);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-30 px-4 md:px-8 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_#064e3b_0%,_#050505_45%)] pointer-events-none opacity-40" />
      
      <div className="relative z-10">
        <RoadmapView roadmap={roadmap} phases={phases} />
      </div>
    </div>
  );
}