"use client";

import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Clock, Coins, Info } from "lucide-react";
import { AlbionItem, BuildDetail, Equipment } from "../types/content";
import { getAlbionImageUrl, parseAlbionTier } from "../utils/albion";

const getQualityColor = (q?: number) => {
  switch (q) {
    case 2:
      return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    case 3:
      return "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]";
    case 4:
      return "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]";
    case 5:
      return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
    default:
      return "bg-slate-500";
  }
};

interface BuildCardProps {
  roleName: string;
  roleColor: string;
  categoryLabel: string;
  buildData: BuildDetail;
}

const colorMap: Record<string, string> = {
  emerald:
    "border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20",
  blue: "border-blue-500 text-blue-400 bg-blue-500/10 shadow-blue-500/20",
  rose: "border-rose-500 text-rose-400 bg-rose-500/10 shadow-rose-500/20",
  orange:
    "border-orange-500 text-orange-400 bg-orange-500/10 shadow-orange-500/20",
  cyan: "border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-cyan-500/20",
  purple:
    "border-purple-500 text-purple-400 bg-purple-500/10 shadow-purple-500/20",
};

export default function BuildCard({
  roleName,
  roleColor,
  categoryLabel,
  buildData,
}: BuildCardProps) {
  const currentStyles = colorMap[roleColor] || colorMap.blue;

  const Slot = ({
    slot,
    label,
    priority = false,
  }: {
    slot: keyof Equipment;
    label: string;
    priority?: boolean;
  }) => {
    const item = buildData.equipment[slot];
    return (
      <div className="relative aspect-square rounded-xl bg-slate-900 border border-slate-800/50 flex flex-col items-center justify-center group shadow-inner">
        {item ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-1 relative">
            <motion.div
              whileHover={{ scale: 1.6, zIndex: 50 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative w-full h-full flex items-center justify-center cursor-zoom-in">
              <NextImage
                src={getAlbionImageUrl(item.id, 128, item.quality)}
                alt={item.name}
                width={128}
                height={128}
                priority={priority}
                className="w-full h-full object-contain"
              />
              {item.quality && item.quality > 1 && (
                <div
                  className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${getQualityColor(item.quality)} border border-white/20 z-20`}
                  title={`Calidad: ${item.quality}`}
                />
              )}
            </motion.div>
          </motion.div>
        ) : (
          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter opacity-40">
            {label}
          </span>
        )}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Professional Item Grid */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-950/40 backdrop-blur-sm border border-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-8">
            <div className="w-full flex justify-between items-center mb-2 px-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse bg-${roleColor}-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]`}
                />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                  Equipment Setup
                </h4>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 w-full">
              {/* 3x3 Grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-[320px]">
                <Slot slot="bag" label="Bag" />
                <Slot slot="head" label="Head" priority={true} />
                <Slot slot="cape" label="Cape" priority={true} />

                <Slot slot="weapon" label="Weapon" priority={true} />
                <Slot slot="armor" label="Armor" priority={true} />
                <Slot slot="offhand" label="Offhand" priority={true} />

                <Slot slot="potion" label="Potion" />
                <Slot slot="shoes" label="Shoes" />
                <Slot slot="food" label="Food" />
              </div>

              {/* Mount Slot */}
              <div className="w-full flex justify-center border-t border-slate-800/50 pt-6">
                <div className="w-24 md:w-28">
                  <Slot slot="mount" label="Mount" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Build Details */}
        <div className="space-y-4">
          {/* Party Role */}
          <div className="bg-slate-900 pb-0.5 rounded-2xl overflow-hidden shadow-xl border border-slate-800/50">
            <div
              className={`px-4 py-2 flex items-center gap-2 border-b border-slate-800 ${currentStyles}`}>
              <Shield className="w-4 h-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">
                Party Role
              </h4>
            </div>
            <div className="p-4 text-slate-300 text-sm leading-relaxed min-h-[100px]">
              {buildData.partyRole}
            </div>
          </div>

          {/* Timing */}
          <div className="bg-slate-900 pb-0.5 rounded-2xl overflow-hidden shadow-xl border border-slate-800/50">
            <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-800 bg-slate-800/50 text-slate-300">
              <Clock className="w-4 h-4" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">
                Timing & Rotación
              </h4>
            </div>
            <div className="p-4 text-slate-300 text-sm leading-relaxed italic">
              {buildData.timing}
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Opción Económica
              </span>
              <span className="text-sm text-slate-200 font-medium">
                {buildData.budget}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
