"use client";

import { useEffect, useState } from "react";
import CelestialBackground from "./components/CelestialBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BuildsClientViewer from "./components/BuildsClientViewer";
import { ContentData } from "./types/content";
import initialData from "./data/content.json";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Evita el renderizado en el servidor para forzar el comportamiento SPA
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1021]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CelestialBackground>
      <main className="min-h-screen px-4 pb-20 max-w-5xl mx-auto flex flex-col items-center relative">
        <Header />
        
        <BuildsClientViewer initialData={initialData as ContentData} />

      </main>
      <Footer />
    </CelestialBackground>
  );
}
