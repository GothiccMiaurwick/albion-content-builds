"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function CelestialBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="celestial-bg min-h-screen w-full relative">
      {/* Background Orbs */}
      <div className="aura-orb w-[600px] h-[600px] bg-blue-500/10 top-[-20%] left-[-10%]" />
      <div className="aura-orb w-[500px] h-[500px] bg-pink-500/10 bottom-[10%] right-[-10%]" />
      <div className="aura-orb w-[400px] h-[400px] bg-gold/5 top-[40%] left-[30%]" />

      {mounted &&
        stars.map((star) => (
          <motion.div
            key={star.id}
            className="star"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
