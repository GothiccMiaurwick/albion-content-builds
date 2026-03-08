"use client";

import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-12 flex flex-col items-center gap-6 border-t border-white/5 bg-black/20 backdrop-blur-md relative z-10">
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-500 text-sm font-light tracking-widest uppercase">
          Created By
        </p>
        <h3 className="text-2xl font-bold gold-text tracking-tighter cinzel-font">
          Miaurwick
        </h3>
      </div>

      <div className="flex gap-6">
        <a
          href="https://github.com/GothiccMiaurwick"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
          title="GitHub"
        >
          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
        <a
          href="https://x.com/MIAURWICK"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
          title="X (Twitter)"
        >
          <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
        Albion Online Build Assistant &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
