"use client";

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import * as Icons from "lucide-react";
import {
  X,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContentData,
  RoleConfig,
  BuildDetail,
  Equipment,
  AlbionItem,
} from "../types/content";
import ItemSelectorModal from "./ItemSelectorModal";
import { getAlbionImageUrl, parseAlbionTier } from "../utils/albion";

// Predefined set of relevant icons for Roles
const PREDEFINED_ICONS = [
  "Shield",
  "Heart",
  "Sword",
  "Settings",
  "Wand2",
  "Target",
  "Hammer",
  "Axe",
  "Sparkles",
  "Flame",
  "Zap",
].sort();

interface BuildEditorProps {
  data: ContentData;
  activeRole: string;
  activeCategory: string;
  onSave: (newData: ContentData, newRoleName?: string) => void;
  onDelete: (roleName: string) => void;
  onClose: () => void;
}

function RoleIconSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const CurrentIcon = (Icons as any)[value] || Icons.HelpCircle;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm hover:border-slate-600 transition-colors group">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <span>{value}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] mt-2 w-full bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {PREDEFINED_ICONS.map((iconName) => {
                const OptionIcon = (Icons as any)[iconName] || Icons.HelpCircle;
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left ${
                      value === iconName
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}>
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        value === iconName
                          ? "bg-emerald-500/20"
                          : "bg-slate-800"
                      }`}>
                      <OptionIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{iconName}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuildEditor({
  data,
  activeRole,
  activeCategory,
  onSave,
  onDelete,
  onClose,
}: BuildEditorProps) {
  const [editedData, setEditedData] = useState<ContentData>(
    JSON.parse(JSON.stringify(data)),
  );
  const [roleName, setRoleName] = useState(activeRole);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectorConfig, setSelectorConfig] = useState<{
    slot: keyof Equipment;
    title: string;
  } | null>(null);

  const role = editedData.roles[activeRole];
  const build = role.builds[activeCategory] || {
    equipment: {
      bag: null,
      head: null,
      cape: null,
      weapon: null,
      armor: null,
      offhand: null,
      potion: null,
      shoes: null,
      food: null,
      mount: null,
    },
    partyRole: "",
    commonErrors: [],
    timing: "",
    budget: "",
  };

  const handleUpdateRole = (field: keyof RoleConfig, value: any) => {
    const updated = { ...editedData };
    updated.roles[activeRole] = {
      ...updated.roles[activeRole],
      [field]: value,
    };
    setEditedData(updated);
  };

  const handleUpdateBuild = (field: keyof BuildDetail, value: any) => {
    const updated = { ...editedData };
    updated.roles[activeRole].builds[activeCategory] = {
      ...build,
      [field]: value,
    };
    setEditedData(updated);
  };

  const handleSetItem = (slot: keyof Equipment, item: AlbionItem | null) => {
    const newEquipment = {
      ...build.equipment,
      [slot]: item ? { ...item, quality: item.quality || 1 } : null,
    };
    handleUpdateBuild("equipment", newEquipment);
    setSelectorConfig(null);
  };

  const handleUpdateQuality = (slot: keyof Equipment, quality: number) => {
    const item = build.equipment[slot];
    if (!item) return;

    const newEquipment = {
      ...build.equipment,
      [slot]: { ...item, quality },
    };
    handleUpdateBuild("equipment", newEquipment);
  };

  const EquipmentSlot = ({
    slot,
    label,
    priority = false,
  }: {
    slot: keyof Equipment;
    label: string;
    priority?: boolean;
  }) => {
    const item = build.equipment[slot];

    const getQualityColor = (q?: number) => {
      switch (q) {
        case 2:
          return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"; // Good
        case 3:
          return "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"; // Outstanding
        case 4:
          return "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"; // Excellent
        case 5:
          return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"; // Masterpiece
        default:
          return "bg-slate-500"; // Normal
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setSelectorConfig({ slot, title: label })}
          className="relative group aspect-square rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-emerald-500/50 flex flex-col items-center justify-center text-center transition-all p-2">
          {item ? (
            <>
              <motion.div
                whileHover={{ scale: 1.6, zIndex: 50 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative w-full h-full flex items-center justify-center cursor-zoom-in mb-1">
                <NextImage
                  src={getAlbionImageUrl(item.id, 128, item.quality)}
                  alt={item.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              {item.quality && item.quality > 1 && (
                <div
                  className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getQualityColor(item.quality)} border border-white/20`}
                />
              )}
            </>
          ) : (
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {label}
            </span>
          )}
          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
        </button>

        {item && (
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateQuality(slot, q);
                }}
                className={`w-3.5 h-3.5 rounded-full border border-white/10 transition-all ${
                  item.quality === q
                    ? getQualityColor(q)
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={`Cambiar calidad a ${q}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col custom-scrollbar">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Editar Clase: <span className="text-emerald-400">{activeRole}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-10 flex-1">
          {/* Role Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Configuración Base
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                  Nombre de la Clase
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-emerald-400 font-bold text-sm outline-none focus:border-emerald-500/30"
                  placeholder="Ej: Solo Tank, DPS PvP, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                  Color del Tema
                </label>
                <div className="flex gap-2 p-1 bg-slate-800/50 border border-slate-700 rounded-lg">
                  {["emerald", "blue", "rose", "orange", "cyan", "purple"].map(
                    (c) => {
                      const colorClasses: Record<string, string> = {
                        emerald: "bg-emerald-500",
                        blue: "bg-blue-500",
                        rose: "bg-rose-500",
                        orange: "bg-orange-500",
                        cyan: "bg-cyan-500",
                        purple: "bg-purple-500",
                      };
                      return (
                        <button
                          key={c}
                          onClick={() => handleUpdateRole("color", c)}
                          className={`w-6 h-6 rounded-md transition-all ${
                            role.color === c
                              ? `${colorClasses[c]} scale-110 shadow-[0_0_10px_rgba(0,0,0,0.5)]`
                              : "bg-slate-700 hover:bg-slate-600 scale-90"
                          }`}
                          title={c}
                        />
                      );
                    },
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                  Icono Global
                </label>
                <RoleIconSelector
                  value={role.icon}
                  onChange={(val) => handleUpdateRole("icon", val)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                Descripción Corta
              </label>
              <textarea
                value={role.description}
                onChange={(e) =>
                  handleUpdateRole("description", e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm h-16 outline-none focus:border-emerald-500/30"
              />
            </div>
          </section>

          {/* Albion Equipment Grid */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Equipamiento (Albion API)
              </h3>
              <button
                onClick={() =>
                  handleUpdateBuild("equipment", {
                    bag: null,
                    head: null,
                    cape: null,
                    weapon: null,
                    armor: null,
                    offhand: null,
                    potion: null,
                    shoes: null,
                    food: null,
                    mount: null,
                  })
                }
                className="text-[10px] font-bold text-slate-600 hover:text-rose-400 flex items-center gap-1 uppercase transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset Grid
              </button>
            </div>

            <div className="flex flex-col items-center gap-8">
              {/* Main Grid 3x3 */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                <EquipmentSlot slot="bag" label="Bag" />
                <EquipmentSlot slot="head" label="Head" priority={true} />
                <EquipmentSlot slot="cape" label="Cape" priority={true} />

                <EquipmentSlot slot="weapon" label="Weapon" priority={true} />
                <EquipmentSlot slot="armor" label="Armor" priority={true} />
                <EquipmentSlot slot="offhand" label="Offhand" priority={true} />

                <EquipmentSlot slot="potion" label="Potion" />
                <EquipmentSlot slot="shoes" label="Shoes" />
                <EquipmentSlot slot="food" label="Food" />
              </div>

              {/* Mount Slot - Beneath */}
              <div className="w-full flex justify-center">
                <div className="w-1/3 max-w-[120px]">
                  <EquipmentSlot slot="mount" label="Mount" />
                </div>
              </div>
            </div>
          </section>

          {/* Additional details */}
          <section className="space-y-5 pt-6 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Rol en la Party
              </label>
              <textarea
                value={build.partyRole}
                onChange={(e) => handleUpdateBuild("partyRole", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm h-24 outline-none focus:border-emerald-500/30"
                placeholder="Explica qué debe hacer esta clase..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Timing & Rotación
              </label>
              <textarea
                value={build.timing}
                onChange={(e) => handleUpdateBuild("timing", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm h-24 outline-none focus:border-emerald-500/30"
                placeholder="¿Cuándo usar las habilidades?"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Opción Económica
              </label>
              <input
                type="text"
                value={build.budget}
                onChange={(e) => handleUpdateBuild("budget", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500/30"
                placeholder="Equivalente Tier mas bajo..."
              />
            </div>
          </section>

          <div className="pt-6">
            {isConfirmingDelete ? (
              <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3 text-rose-400 text-sm font-medium">
                  <AlertCircle className="w-5 h-5" />
                  ¿Seguro que quieres eliminar esta clase de la sección{" "}
                  {activeCategory}?
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onDelete(activeRole)}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/20">
                    SÍ, ELIMINAR
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition-all">
                    CANCELAR
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="text-slate-600 hover:text-rose-500 text-[10px] font-bold flex items-center gap-2 transition-all uppercase tracking-[0.3em] w-full justify-center py-4 border border-transparent hover:border-rose-500/20 rounded-xl">
                <Trash2 className="w-4 h-4" />
                Eliminar Clase de esta Sección
              </button>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-20">
          <button
            onClick={() => {
              // Handle role renaming if name changed
              let finalData = { ...editedData };
              if (roleName !== activeRole) {
                // If the name already exists in OTHER roles, warn (unless it's just this one)
                if (finalData.roles[roleName] && roleName !== activeRole) {
                  alert("Ya existe una clase con ese nombre.");
                  return;
                }
                const roleConfig = finalData.roles[activeRole];
                delete finalData.roles[activeRole];
                finalData.roles[roleName] = roleConfig;
              }
              onSave(finalData, roleName);
            }}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/40 transition-all active:scale-[0.98]">
            <Save className="w-5 h-5" /> GUARDAR TODO EL CONTENIDO
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectorConfig && (
          <ItemSelectorModal
            title={selectorConfig.title}
            onClose={() => setSelectorConfig(null)}
            onSelect={(item) => handleSetItem(selectorConfig.slot, item)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
