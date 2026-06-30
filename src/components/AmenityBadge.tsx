"use client";

import type { ReactNode } from "react";

interface AmenityBadgeProps {
  label: string;
  active: boolean;
  icon: ReactNode;
  onClick?: () => void;
  toggleable?: boolean;
}

export default function AmenityBadge({
  label,
  active,
  icon,
  onClick,
  toggleable = false,
}: AmenityBadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200";
  const activeClass =
    "border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold-light)] shadow-[0_0_0_4px_rgba(240,180,41,0.06)]";
  const inactiveClass =
    "border border-[var(--border)] bg-white/[0.02] text-[var(--text-faint)]";
  const clickableClass = toggleable ? "cursor-pointer hover:scale-[1.03]" : "";

  return (
    <span
      className={`${base} ${active ? activeClass : inactiveClass} ${clickableClass}`}
      onClick={onClick}
      role={toggleable ? "button" : undefined}
      tabIndex={toggleable ? 0 : undefined}
      onKeyDown={
        toggleable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
    >
      <span className="inline-flex items-center [&>svg]:w-3.5 [&>svg]:h-3.5">
        {icon}
      </span>
      {label}
    </span>
  );
}
