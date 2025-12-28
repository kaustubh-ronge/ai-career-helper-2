"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { 
  Menu, X, LayoutDashboard, FileText, PenTool, 
  Mic2, Sparkles, Map, Crown, ChevronRight 
} from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"; 
import { Button } from "@/components/ui/button";

export const Header = ({ userCredits }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll for glass effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cover Letter", href: "/dashboard/cover-letter", icon: PenTool },
    { name: "Interview", href: "/dashboard/interview", icon: Mic2 },
    { name: "Roadmap", href: "/dashboard/roadmap", icon: Map },
  ];

  // Mobile Menu Animation Variants
  const menuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-[#050505]/80 backdrop-blur-xl border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "bg-transparent border-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group relative z-50">
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-500">
             <div className="absolute inset-0 bg-white/40 rotate-12 translate-y-full group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out" />
             <Sparkles className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 hidden sm:block tracking-tight">
            CivicCoach
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} className="relative px-5 py-2 group">
                {isActive && (
                  <motion.div 
                    layoutId="desktopNav" 
                    className="absolute inset-0 bg-white/10 rounded-full" 
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            {/* Log In - Ghost Glass */}
            <Link href="/sign-in">
                <Button 
                    variant="ghost" 
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                    Log In
                </Button>
            </Link>

            {/* Get Started - Premium Animated Glass */}
            <Link href="/sign-up" className="relative group">
                {/* Background Glow Blob */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Main Button Body */}
                <div className="relative px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 group-hover:border-white/30 overflow-hidden">
                    <span className="relative z-10 drop-shadow-sm">Get Started</span>
                    
                    {/* Shine Sweep Animation */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                </div>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-5">
              {/* Credits HUD */}
              {userCredits && (
                <div className="hidden xl:flex items-center gap-4 px-5 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md shadow-inner">
                   {/* Interview */}
                   <div className="flex items-center gap-2 group cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-shadow" />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Int <span className="text-white ml-1">{userCredits.interviewCredits}</span>
                      </span>
                   </div>
                   <div className="w-px h-3 bg-white/10" />
                   {/* Cover Letter */}
                   <div className="flex items-center gap-2 group cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-shadow" />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Cov <span className="text-white ml-1">{userCredits.coverLetterCredits}</span>
                      </span>
                   </div>
                   <div className="w-px h-3 bg-white/10" />
                   {/* Roadmap */}
                   <div className="flex items-center gap-2 group cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-shadow" />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Map <span className="text-white ml-1">{userCredits.roadmapCredits}</span>
                      </span>
                   </div>
                </div>
              )}
              
              <Link href="/dashboard/upgrade">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 hover:border-amber-400 h-9 rounded-full text-xs font-bold uppercase tracking-wider gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all"
                >
                  <Crown className="w-3.5 h-3.5" /> Upgrade
                </Button>
              </Link>

              <div className="pl-2 border-l border-white/10">
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{ 
                    elements: { 
                      avatarBox: "w-9 h-9 ring-2 ring-white/10 hover:ring-white/30 transition-all" 
                    } 
                  }}
                />
              </div>
            </div>
          </SignedIn>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="md:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-xl border border-white/10 active:scale-95 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      {/* =============================================
          MOBILE SIDE DRAWER
         =============================================
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div 
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[60%] bg-[#0A0A0A] border-l border-white/10 z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                     <Sparkles className="w-4 h-4 text-white" />
                   </div>
                   <span className="font-bold text-white tracking-tight">Menu</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                
                {/* Navigation Links */}
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 pl-2">Navigation</h3>
                  {navItems.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <motion.div variants={itemVariants} key={item.name}>
                          <Link 
                            href={item.href} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                              isActive 
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                                : "text-slate-400 hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} /> 
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`} />
                          </Link>
                        </motion.div>
                      )
                  })}
                </div>

                {/* Account Section */}
                <motion.div variants={itemVariants} className="mt-auto">
                   
                   <SignedIn>
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 pl-2">Your Account</h3>
                      
                      {/* Mobile Credits Grid */}
                      {userCredits && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                           <div className="bg-[#111] p-3 rounded-2xl border border-white/5 text-center relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Int</span>
                              <div className="text-lg font-bold text-white mt-1">{userCredits.interviewCredits}</div>
                           </div>
                           <div className="bg-[#111] p-3 rounded-2xl border border-white/5 text-center relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50" />
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cov</span>
                              <div className="text-lg font-bold text-white mt-1">{userCredits.coverLetterCredits}</div>
                           </div>
                           <div className="bg-[#111] p-3 rounded-2xl border border-white/5 text-center relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50" />
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Map</span>
                              <div className="text-lg font-bold text-white mt-1">{userCredits.roadmapCredits}</div>
                           </div>
                        </div>
                      )}
                      
                      <Link 
                        href="/dashboard/upgrade" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="flex justify-center items-center gap-2 py-4 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-900/20 rounded-xl font-bold mb-4 active:scale-[0.98] transition-transform"
                      >
                          <Crown className="w-5 h-5" /> Upgrade Plan
                      </Link>

                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-white">My Profile</span>
                           <span className="text-xs text-slate-500">Manage settings</span>
                        </div>
                      </div>
                   </SignedIn>

                   <SignedOut>
                      <div className="flex flex-col gap-4">
                        <Link 
                          href="/sign-in" 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="flex justify-center items-center py-4 text-slate-300 hover:text-white bg-white/5 rounded-xl font-bold border border-white/10 transition-colors"
                        >
                          Log In
                        </Link>
                        
                        {/* Mobile Get Started */}
                        <Link 
                          href="/sign-up" 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="relative flex justify-center items-center py-4 rounded-xl font-bold overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20" />
                          <span className="relative z-10 text-white">Get Started</span>
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </Link>
                      </div>
                   </SignedOut>

                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};