"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, LayoutDashboard, FileText, PenTool, Mic2, Sparkles, Map, Crown, Zap } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"; 
import { Button } from "@/components/ui/button";

export const Header = ({ userCredits }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cover Letter", href: "/dashboard/cover-letter", icon: PenTool },
    { name: "Interview", href: "/dashboard/interview", icon: Mic2 },
    { name: "Roadmap", href: "/dashboard/roadmap", icon: Map },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group relative z-50">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5)]">
             <div className="absolute inset-0 bg-white/30 rotate-45 translate-y-full group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out" />
             <Sparkles className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 hidden sm:block">
            CivicCoach
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 p-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} className="relative px-3 py-2 group">
                {isActive && <motion.div layoutId="activeNav" className="absolute inset-0 bg-white/10 rounded-full" />}
                <span className={`relative z-10 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="text-slate-300 hover:text-white text-sm font-medium">Log In</Link>
            <Link href="/sign-up" className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200">Get Started</Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              {userCredits && (
                <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-[#1a1f2e] border border-white/10 rounded-full shadow-inner">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> {userCredits.interviewCredits} INT
                   </div>
                   <div className="w-px h-3 bg-white/10"/>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> {userCredits.coverLetterCredits} COV
                   </div>
                   <div className="w-px h-3 bg-white/10"/>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"/> {userCredits.roadmapCredits} MAP
                   </div>
                </div>
              )}
              
              <Link href="/dashboard/upgrade">
                <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 text-xs font-bold uppercase tracking-wider gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Upgrade
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-white/10" } }}/>
            </div>
          </SignedIn>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black/95 border-b border-white/10">
             <div className="p-4 space-y-2">
                {navItems.map((item) => (
                   <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-slate-300 hover:bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-indigo-500" /> {item.name}
                   </Link>
                ))}
                <div className="pt-4 border-t border-white/10">
                   <SignedIn>
                      <Link href="/dashboard/upgrade" className="flex justify-center items-center gap-2 py-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold">
                         <Crown className="w-4 h-4" /> Upgrade Plan
                      </Link>
                      <div className="flex justify-center mt-4"><UserButton /></div>
                   </SignedIn>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};