"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, LayoutDashboard, FileText, PenTool, Mic2, Sparkles, Map, Crown, LogOut } from "lucide-react";
import { UserButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs"; 
import { Button } from "@/components/ui/button";

export const Header = ({ userCredits }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

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
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative z-50">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5)]">
             <div className="absolute inset-0 bg-white/30 rotate-45 translate-y-full group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out" />
             <Sparkles className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 hidden sm:block">
            CivicCoach
          </span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Desktop Actions */}
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

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10 active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      {/* =============================================
        MOBILE SIDE DRAWER IMPLEMENTATION
        =============================================
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop - Closes menu on click */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Sliding Drawer */}
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[60%] bg-[#0F1117] border-l border-white/10 z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/5">
                <span className="font-bold text-lg text-white">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Navigation Links */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Navigation</h3>
                  {navItems.map((item) => {
                     const isActive = pathname.startsWith(item.href);
                     return (
                        <Link 
                          key={item.name} 
                          href={item.href} 
                          onClick={() => setMobileMenuOpen(false)} 
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            isActive 
                              ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                              : "text-slate-300 hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} /> 
                          {item.name}
                        </Link>
                     )
                  })}
                </div>

                {/* User Section */}
                <div className="pt-4 border-t border-white/5">
                   <SignedIn>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Account</h3>
                      
                      {/* Mobile Credits Grid */}
                      {userCredits && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                           <div className="bg-emerald-500/5 p-3 rounded-xl text-center border border-emerald-500/10">
                              <span className="block text-[10px] text-emerald-300/70 uppercase tracking-wider mb-1">Int</span>
                              <span className="text-emerald-400 font-bold text-sm">{userCredits.interviewCredits}</span>
                           </div>
                           <div className="bg-purple-500/5 p-3 rounded-xl text-center border border-purple-500/10">
                              <span className="block text-[10px] text-purple-300/70 uppercase tracking-wider mb-1">Cov</span>
                              <span className="text-purple-400 font-bold text-sm">{userCredits.coverLetterCredits}</span>
                           </div>
                           <div className="bg-cyan-500/5 p-3 rounded-xl text-center border border-cyan-500/10">
                              <span className="block text-[10px] text-cyan-300/70 uppercase tracking-wider mb-1">Map</span>
                              <span className="text-cyan-400 font-bold text-sm">{userCredits.roadmapCredits}</span>
                           </div>
                        </div>
                      )}
                      
                      <Link 
                        href="/dashboard/upgrade" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="flex justify-center items-center gap-2 py-3 w-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold mb-3"
                      >
                         <Crown className="w-4 h-4" /> Upgrade Plan
                      </Link>

                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-white">Manage Profile</span>
                           <span className="text-xs text-slate-500">Account settings</span>
                        </div>
                      </div>
                   </SignedIn>

                   <SignedOut>
                      <div className="flex flex-col gap-3">
                        <Link 
                          href="/sign-in" 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="flex justify-center items-center py-3 text-slate-300 hover:text-white bg-white/5 rounded-xl font-medium border border-white/5"
                        >
                          Log In
                        </Link>
                        <Link 
                          href="/sign-up" 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="flex justify-center items-center py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200"
                        >
                          Get Started
                        </Link>
                      </div>
                   </SignedOut>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};