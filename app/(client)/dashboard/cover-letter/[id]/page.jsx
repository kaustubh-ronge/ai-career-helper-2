import React from "react";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CoverLetterView } from "./_components/CoverLetterView";

export default async function CoverLetterPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const user = await checkUser();
  if (!user) return redirect("/sign-in");

  // Fetch Letter & User details (for the header)
  const letter = await db.coverLetter.findUnique({
    where: { 
      id: id,
      userId: user.clerkUserId 
    }
  });

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.clerkUserId }
  });

  if (!letter) return redirect("/dashboard/cover-letter");

  return (
    <div className="min-h-screen bg-[#050505] text-white py-25 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
         <CoverLetterView letter={letter} user={dbUser} />
      </div>
    </div>
  );
}