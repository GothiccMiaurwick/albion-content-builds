import * as Icons from "lucide-react";

interface RoleBadgeProps {
  name: string;
  iconName: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
}

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: {
    bg: "bg-blue-950/30",
    border: "border-blue-500/50",
    text: "text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/50",
    text: "text-emerald-400",
  },
  rose: {
    bg: "bg-rose-950/30",
    border: "border-rose-500/50",
    text: "text-rose-400",
  },
  orange: {
    bg: "bg-orange-950/30",
    border: "border-orange-500/50",
    text: "text-orange-400",
  },
};

export default function RoleBadge({
  name,
  iconName,
  color,
  active,
  onClick,
}: RoleBadgeProps) {
  const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
        active
          ? `${colors.bg} ${colors.border} ${colors.text} shadow-[0_0_15px_rgba(0,0,0,0.2)]`
          : "border-transparent text-slate-500 hover:text-slate-400"
      }`}>
      <Icon className="w-4 h-4" />
      <span className="text-[13px] font-semibold tracking-wider uppercase">
        {name}
      </span>
    </div>
  );
}
