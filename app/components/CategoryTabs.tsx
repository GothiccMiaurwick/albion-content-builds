"use client";

import { Category } from "../types/content";

interface CategoryTabsProps {
  categories: Category[];
  activeTab: string | null;
  onTabChange: (id: string) => void;
}

export default function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
      {categories.map((cat) => (
        <div key={cat.id} className="relative group">
          <button
            onClick={() => onTabChange(cat.id)}
            className={`px-6 py-2 rounded-lg border transition-all duration-500 text-sm tracking-wide ${
              activeTab === cat.id
                ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
            }`}>
            {cat.label}
          </button>

          {/* Active Marker (Triangle) */}
          {activeTab === cat.id && (
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-emerald-500/80 animate-in fade-in slide-in-from-top-1" />
          )}
        </div>
      ))}
    </div>
  );
}
