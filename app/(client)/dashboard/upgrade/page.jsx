import React from 'react';
import { checkUser } from '@/lib/checkUser';
import { db } from '@/lib/prisma';
import UpgradeClient from './_components/UpgradeClient'; 

export default async function UpgradePage() {
    // 1. Authenticate
    const user = await checkUser();
    
    // 2. Fetch User Plan from DB
    const dbUser = await db.user.findUnique({
        where: { clerkUserId: user.clerkUserId },
        select: { plan: true }
    });

    // 3. Render Client Component with Plan Data
    return <UpgradeClient currentPlan={dbUser?.plan || "free"} />;
}