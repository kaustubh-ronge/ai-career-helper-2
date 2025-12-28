"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * ACTION 1: Create Order
 * Called when user clicks "Buy Now"
 */
export async function createOrderAction(amount) {
  try {
    const user = await checkUser();
    if (!user) return { success: false, error: "User not authenticated" };

    const options = {
      amount: amount * 100, // Amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}_${user.clerkUserId.slice(0, 5)}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };

  } catch (error) {
    console.error("Create Order Error:", error);
    return { success: false, error: "Failed to initiate payment" };
  }
}

/**
 * ACTION 2: Verify Payment & Add Credits
 * Called after Razorpay popup closes successfully
 */
export async function verifyPaymentAction(data) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = data;
    const user = await checkUser();
    if (!user) return { success: false, error: "User not authenticated" };

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid Payment Signature" };
    }

    // 2. Define Credits based on Plan
    let creditsToAdd = { interview: 0, coverLetter: 0, roadmap: 0 };
    let amount = 0;

    if (planType === "monthly_399") {
      creditsToAdd = { interview: 6, coverLetter: 10, roadmap: 16 };
      amount = 399;
    } else if (planType === "yearly_799") {
      creditsToAdd = { interview: 12, coverLetter: 20, roadmap: 32 };
      amount = 799;
    }

    // 3. Update Database (Transaction)
    await db.$transaction([
      db.user.update({
        where: { clerkUserId: user.clerkUserId },
        data: {
          interviewCredits: { increment: creditsToAdd.interview },
          coverLetterCredits: { increment: creditsToAdd.coverLetter },
          roadmapCredits: { increment: creditsToAdd.roadmap },
          plan: planType // Update their tier status
        }
      }),
      db.transaction.create({
        data: {
          userId: user.clerkUserId,
          amount: amount,
          credits: creditsToAdd,
          paymentId: razorpay_payment_id,
          planType: planType
        }
      })
    ]);

    revalidatePath("/dashboard"); 
    return { success: true };

  } catch (error) {
    console.error("Verification Error:", error);
    return { success: false, error: "Payment verification failed" };
  }
}