"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function CelestialBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate random stable stars for SSR
  const starsInfo = Array.from({ length: 150 }).map((_, i) => {
    // Note: To ensure SSR hydration perfectly matches, 
    // we use a pseudo-random hash based on index instead of Math.random
    const pseudoRandom = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Use toFixed(3) on all computed values to prevent floating-point precision hydration mismatches
    return {
      id: i,
      x: (pseudoRandom(i * 10) * 100).toFixed(3),
      y: (pseudoRandom(i * 20) * 100).toFixed(3),
      size: (pseudoRandom(i * 30) * 2 + 1).toFixed(3),
      duration: (pseudoRandom(i * 40) * 3 + 2).toFixed(3),
    };
  });

  return (
    <div className="celestial-bg min-h-screen w-full relative">
      <div className="aura-orb w-[600px] h-[600px] bg-blue-500/10 top-[-20%] left-[-10%]" />
      <div className="aura-orb w-[500px] h-[500px] bg-pink-500/10 bottom-[10%] right-[-10%]" />
      <div className="aura-orb w-[400px] h-[400px] bg-gold/5 top-[40%] left-[30%]" />

      {starsInfo.map((star) => (
        <div
          key={star.id}
          className="star absolute bg-white rounded-full shadow-[0_0_2px_#fff]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.2,
            animationDuration: `${star.duration}s`,
            animationName: 'twinkle',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
