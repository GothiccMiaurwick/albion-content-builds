"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Plus } from "lucide-react";
import { toast } from "sonner";
import CategoryTabs from "./CategoryTabs";
import RoleBadge from "./RoleBadge";
import BuildCard from "./BuildCard";
import dynamic from "next/dynamic";
import { ContentData, RoleConfig } from "../types/content";

const BuildEditor = dynamic(() => import("./BuildEditor"), {
  ssr: false, // The editor is heavy and only needed on interaction
  loading: () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  ),
});

interface BuildsClientViewerProps {
  initialData: ContentData;
}

export default function BuildsClientViewer({ initialData }: BuildsClientViewerProps) {
  const [data, setData] = useState<ContentData>(initialData);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialData.categories.length > 0 ? initialData.categories[0].id : null
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Restore from localStorage on client-side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("albion-builds-data");
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Merge in new categories from initialData that aren't in localStorage yet
        const currentCats = parsed.categories || [];
        const missingCats = initialData.categories.filter(
          (c) => !currentCats.find((ec: any) => ec.id === c.id)
        );
        if (missingCats.length > 0) {
          parsed.categories = [...currentCats, ...missingCats];
        }

        setData(parsed);
        if (parsed.categories?.length > 0 && !activeCategory) {
          setActiveCategory(parsed.categories[0].id);
        }
      }
    } catch (err) {
      console.error("Local storage load error", err);
    }
  }, []);

  const handleSave = async (newData: ContentData, newRoleId?: string) => {
    // Optimistic UI Update & LocalStorage Persistence
    setData(newData);
    if (newRoleId) setSelectedRole(newRoleId);
    setIsEditorOpen(false);
    
    try {
      localStorage.setItem("albion-builds-data", JSON.stringify(newData));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        toast.success("¡Contenido guardado exitosamente!");
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.success("Guardado localmente. (Nota: La web está en modo lectura por el servidor en la nube)");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      toast.warning("Guardado de forma local (Sin conexión con el servidor)");
    }
  };

  const handleAddRole = async () => {
    if (!data || !activeCategory) return;
    const newRoleId = crypto.randomUUID();
    const newRoleName = `Clase Nueva ${Object.keys(data.roles).length + 1}`;

    const newRole: RoleConfig = {
      name: newRoleName,
      icon: "Shield",
      color: "blue",
      description: "Nueva clase añadida. Edítame para configurar los detalles.",
      builds: {
        [activeCategory]: {
          equipment: {
            bag: null, head: null, cape: null, weapon: null, armor: null,
            offhand: null, potion: null, shoes: null, food: null, mount: null,
          },
          partyRole: "Define el rol en la party",
          commonErrors: [],
          timing: "Define el timing de habilidades",
          budget: "Define opción económica",
        },
      },
    };

    const newData = {
      ...data,
      roles: {
        ...data.roles,
        [newRoleId]: newRole,
      },
    };

    await handleSave(newData);
    setSelectedRole(newRoleId);
    setIsEditorOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!data || !activeCategory) return;
    const updatedData = { ...data };
    const role = updatedData.roles[roleId];

    if (role) {
      delete role.builds[activeCategory];
      if (Object.keys(role.builds).length === 0) {
        delete updatedData.roles[roleId];
      }
    }

    const availableRoles = Object.keys(updatedData.roles).filter(
      (r) => updatedData.roles[r].builds[activeCategory],
    );

    setSelectedRole(availableRoles.length > 0 ? availableRoles[0] : null);
    await handleSave(updatedData);
  };

  const rolesInCategory = Object.keys(data.roles).filter(
    (roleId) => data.roles[roleId].builds[activeCategory || ""]
  );

  const currentCategory = data.categories.find((c) => c.id === activeCategory);

  const activeRole =
    selectedRole && rolesInCategory.includes(selectedRole)
      ? selectedRole
      : rolesInCategory[0] || null;

  const roleConfig = activeRole ? data.roles[activeRole] : null;
  const buildData = roleConfig && activeCategory ? roleConfig.builds[activeCategory] : null;

  return (
    <>
      <div className="absolute top-8 right-8 flex gap-2 z-50">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-2 rounded-full border transition-all ${
            isEditing
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              : "bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white"
          }`}
          title="Toggle Edit Mode">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <CategoryTabs
        categories={data.categories}
        activeTab={activeCategory}
        onTabChange={(id) => {
          setActiveCategory(id);
          setSelectedRole(null);
        }}
      />

      <AnimatePresence mode="wait">
        {activeCategory && activeRole && roleConfig && buildData ? (
          <motion.div
            key={`${activeCategory}-${activeRole}`}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full space-y-8">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-6 items-center">
              {rolesInCategory.map((roleId) => (
                <RoleBadge
                  key={roleId}
                  name={data.roles[roleId].name || roleId}
                  iconName={data.roles[roleId].icon}
                  color={data.roles[roleId].color}
                  active={activeRole === roleId}
                  onClick={() => setSelectedRole(roleId)}
                />
              ))}

              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all font-bold uppercase tracking-wider text-[11px]">
                    Editar Clase
                  </button>
                  <button
                    onClick={handleAddRole}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-dashed border-slate-600 bg-slate-800/50 text-slate-400 hover:text-white transition-all font-bold uppercase tracking-wider text-[11px]">
                    <Plus className="w-4 h-4" />
                    Añadir Clase
                  </button>
                </div>
              )}
            </div>

            <p className="text-center text-slate-400 text-sm max-w-md mx-auto py-2 italic font-light">
              {roleConfig.description}
            </p>

            <BuildCard
              roleName={roleConfig.name || activeRole}
              roleColor={roleConfig.color}
              categoryLabel={currentCategory?.label || ""}
              buildData={buildData}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-20 text-slate-500 italic">
            <p>No hay clases disponibles en esta categoría.</p>
            {isEditing && (
              <button
                onClick={handleAddRole}
                className="mt-4 flex items-center gap-2 px-6 py-2 rounded-lg border border-dashed border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all">
                <Plus className="w-5 h-5" />
                Crear Primera Clase
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isEditorOpen && activeCategory && activeRole && (
        <BuildEditor
          data={data}
          activeRole={activeRole}
          activeCategory={activeCategory}
          onSave={handleSave}
          onDelete={handleDeleteRole}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  );
}
