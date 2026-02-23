"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Save, X, Plus } from "lucide-react";
import CelestialBackground from "./components/CelestialBackground";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import RoleBadge from "./components/RoleBadge";
import BuildCard from "./components/BuildCard";
import BuildEditor from "./components/BuildEditor";
import { ContentData, RoleConfig } from "./types/content";

export default function Home() {
  const [data, setData] = useState<ContentData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        if (d.categories.length > 0) {
          setActiveCategory(d.categories[0].id);
        }
      });
  }, []);

  const handleSave = async (newData: ContentData, newRoleName?: string) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setData(newData);
        if (newRoleName) {
          setSelectedRole(newRoleName);
        }
        setIsEditorOpen(false);
      }
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleAddRole = async () => {
    if (!data || !activeCategory) return;
    const newRoleName = `Clase Nueva ${Object.keys(data.roles).length + 1}`;

    // Create a default role template
    const newRole: RoleConfig = {
      icon: "Shield",
      color: "blue",
      description: "Nueva clase añadida. Edítame para configurar los detalles.",
      builds: {
        [activeCategory]: {
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
          partyRole: "Define el rol en la party",
          commonErrors: ["Error 1"],
          timing: "Define el timing de habilidades",
          budget: "Define opción económica",
        },
      },
    };

    const newData = {
      ...data,
      roles: {
        ...data.roles,
        [newRoleName]: newRole,
      },
    };

    await handleSave(newData);
    setSelectedRole(newRoleName);
    setIsEditorOpen(true);
  };

  const handleDeleteRole = async (roleName: string) => {
    if (!data || !activeCategory) return;
    const updatedData = { ...data };
    const role = updatedData.roles[roleName];

    if (role) {
      // Remove build for active category
      delete role.builds[activeCategory];

      // If no builds left, remove the role entirely
      if (Object.keys(role.builds).length === 0) {
        delete updatedData.roles[roleName];
      }
    }

    const availableRoles = Object.keys(updatedData.roles).filter(
      (r) => updatedData.roles[r].builds[activeCategory],
    );

    if (availableRoles.length > 0) {
      setSelectedRole(availableRoles[0]);
    } else {
      setSelectedRole(null);
    }

    await handleSave(updatedData);
  };

  if (!data) return null;

  // Filter roles to show only those present in the current category
  const rolesInCategory = Object.keys(data.roles).filter(
    (roleName) => data.roles[roleName].builds[activeCategory || ""],
  );

  const currentCategory = data.categories.find((c) => c.id === activeCategory);

  // Ensure selectedRole is valid for the current category
  const activeRole =
    selectedRole && rolesInCategory.includes(selectedRole)
      ? selectedRole
      : rolesInCategory[0] || null;

  const roleConfig = activeRole ? data.roles[activeRole] : null;
  const buildData =
    roleConfig && activeCategory ? roleConfig.builds[activeCategory] : null;

  return (
    <CelestialBackground>
      <main className="min-h-screen px-4 pb-20 max-w-5xl mx-auto flex flex-col items-center relative">
        <Header />

        <div className="absolute top-8 right-8 flex gap-2">
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
            setSelectedRole(null); // Reset selection when changing category
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
                {rolesInCategory.map((roleName) => (
                  <RoleBadge
                    key={roleName}
                    name={roleName}
                    iconName={data.roles[roleName].icon}
                    color={data.roles[roleName].color}
                    active={activeRole === roleName}
                    onClick={() => setSelectedRole(roleName)}
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
                roleName={activeRole}
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
      </main>
    </CelestialBackground>
  );
}
