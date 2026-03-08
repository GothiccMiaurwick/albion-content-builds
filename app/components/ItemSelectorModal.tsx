"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAlbionImageUrl, parseAlbionTier } from "../utils/albion";
import { AlbionItem } from "../types/content";

interface ItemSelectorModalProps {
  onSelect: (item: AlbionItem) => void;
  onClose: () => void;
  title: string;
}

export default function ItemSelectorModal({
  onSelect,
  onClose,
  title,
}: ItemSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<AlbionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, AlbionItem[]>>({});

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      const query = search.toLowerCase().trim();
      if (cache[query]) {
        setResults(cache[query]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/albion/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        // Map API response to AlbionItem, favoring Spanish and appending Tier
        const mappedData: AlbionItem[] = data.map((item: any) => {
          const tier = parseAlbionTier(item.id);
          const name = item.name_es || item.name_en;
          return {
            id: item.id,
            name: tier ? `${name} ${tier.replace("T", "T.")}` : name,
          };
        });
        setCache((prev) => ({ ...prev, [query]: mappedData }));
        setResults(mappedData);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, cache]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">
            Seleccionar {title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar objeto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-emerald-500/50 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 space-y-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <div className="text-slate-500 text-sm italic">
                Buscando en la base de datos...
              </div>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all text-left group">
                <div className="w-16 h-16 rounded-xl bg-slate-950/50 flex items-center justify-center border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                  <motion.div
                    whileHover={{ scale: 1.5, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative w-14 h-14 flex items-center justify-center cursor-zoom-in">
                    <NextImage
                      src={getAlbionImageUrl(item.id, 64, 1)}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-white text-base font-semibold truncate">
                      {item.name}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}

          {!loading && results.length === 0 && search.length >= 2 && (
            <div className="text-center py-10 text-slate-500 italic text-sm">
              No se encontraron objetos para "{search}".
            </div>
          )}

          {!loading && search.length < 2 && (
            <div className="text-center py-10 text-slate-500 italic text-sm">
              Escribe al menos 2 caracteres para buscar...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
