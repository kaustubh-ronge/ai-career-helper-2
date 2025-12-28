"use client";
import React, { useState } from "react";
import { Check, Loader2, Zap, Crown, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrderAction, verifyPaymentAction } from "@/actions/payment";
import { useRazorpay } from "react-razorpay";

export default function UpgradeClient({ currentPlan }) {
  // FIX: Destructure as Object {}, not Array []
  const { Razorpay } = useRazorpay(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Plan Hierarchy Logic
  const planLevels = { "free": 0, "monthly_399": 1, "yearly_799": 2 };
  const currentLevel = planLevels[currentPlan] || 0;

  const plans = [
    {
      id: "monthly_399",
      name: "Starter Bundle",
      price: 399,
      level: 1,
      features: ["6 AI Mock Interviews", "10 Smart Cover Letters", "16 Career Roadmaps", "Priority Support"],
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500 to-teal-600",
      popular: false
    },
    {
      id: "yearly_799",
      name: "Pro Pack",
      price: 799,
      level: 2,
      features: ["12 AI Mock Interviews", "20 Smart Cover Letters", "32 Career Roadmaps", "Analytics Access"],
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500 to-indigo-600",
      popular: true
    }
  ];

  const handlePayment = async (plan) => {
    setLoading(true);
    try {
      const orderResult = await createOrderAction(plan.price);
      if (!orderResult.success) throw new Error(orderResult.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderResult.amount,
        currency: "INR",
        name: "CivicCoach",
        description: `Upgrade: ${plan.name}`,
        order_id: orderResult.orderId,
        handler: async function (response) {
          toast.loading("Verifying Payment...");
          const verifyResult = await verifyPaymentAction({
             razorpay_order_id: response.razorpay_order_id,
             razorpay_payment_id: response.razorpay_payment_id,
             razorpay_signature: response.razorpay_signature,
             planType: plan.id
          });
          toast.dismiss();
          if (verifyResult.success) {
             toast.success("Upgraded Successfully!");
             router.push("/dashboard");
             router.refresh(); 
          } else {
             toast.error("Verification Failed");
          }
          setLoading(false);
        },
        theme: { color: "#10B981" },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
      rzp1.on("payment.failed", () => { toast.error("Payment Failed"); setLoading(false); });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4 relative overflow-hidden">
       {/* Background */}
       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
       
       <div className="max-w-5xl mx-auto text-center space-y-4 mb-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
             Choose Your Power
          </h1>
          <p className="text-slate-400 text-lg">
             Current Plan: <span className="text-white font-bold uppercase tracking-widest">{currentPlan.replace('_', ' ')}</span>
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
          {plans.map((plan) => {
             // Disable logic
             const isDowngrade = plan.level <= currentLevel;
             
             return (
               <div key={plan.id} className={`relative p-8 rounded-3xl border ${isDowngrade ? "border-white/5 opacity-70 grayscale-[0.5]" : "border-white/10 bg-[#0F121C] hover:border-white/20"} transition-all group ${plan.popular && !isDowngrade ? "scale-105 shadow-2xl shadow-purple-500/20 border-purple-500/30" : ""}`}>
                  
                  {plan.popular && !isDowngrade && (
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Recommended
                     </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                     <div className="p-3 bg-white/5 rounded-2xl">
                        {plan.icon}
                     </div>
                     <div className="text-right">
                        <p className="text-3xl font-bold text-white">₹{plan.price}</p>
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">Unlock premium AI limits instantly.</p>

                  <div className="space-y-4 mb-8">
                     {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                           <Check className="w-3 h-3 text-emerald-400" />
                           {feat}
                        </div>
                     ))}
                  </div>

                  <button 
                    onClick={() => handlePayment(plan)}
                    disabled={loading || isDowngrade}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isDowngrade 
                        ? "bg-white/10 text-slate-500 cursor-not-allowed" 
                        : `text-white bg-gradient-to-r ${plan.color} hover:opacity-90`
                    }`}
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5"/> : (
                        isDowngrade ? <><Lock className="w-4 h-4"/> Active / Lower Plan</> : "Upgrade Now"
                    )}
                  </button>
               </div>
             );
          })}
       </div>
    </div>
  );
}