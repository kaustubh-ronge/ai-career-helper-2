import React from 'react';
import { checkUser } from '@/lib/checkUser'; 
import { db } from '@/lib/prisma';
import { Header } from './Header';

export const HeaderServer = async () => {
  const user = await checkUser(); 
  
  let userCredits = null;
  if (user) {
      userCredits = await db.user.findUnique({
          where: { clerkUserId: user.clerkUserId },
          select: {
              interviewCredits: true,
              coverLetterCredits: true,
              roadmapCredits: true
          }
      });
  }

  return <Header userCredits={userCredits} />;
};