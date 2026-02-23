import { Moon, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-col items-center py-12 px-4 text-center">
      <div className="relative mb-4">
        <Moon className="w-16 h-16 text-gold fill-gold opacity-80" />
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-wider gold-text mb-2">
        Albion Party Builds
      </h1>
      <p className="text-sm md:text-base text-slate-400 font-light tracking-[0.2em] uppercase">
        Menos estrés • Mejores partys
      </p>
    </header>
  );
}
