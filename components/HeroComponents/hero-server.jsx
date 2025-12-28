import React from 'react';
import { HeroClient } from './hero-client';

export const HeroServer = () => {
  return (
    <section className="relative w-full min-h-[110vh] bg-[#050505] overflow-hidden text-white">
      {/* Static Base Gradient (Fallback & Depth Layer) 
        This ensures the page doesn't look flat before JS loads
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_#1e1b4b_0%,_#000000_60%)] opacity-40 pointer-events-none" />
      
      {/* Client Component handling Animations & Interactive Elements */}
      <HeroClient />
      
    </section>
  );
};