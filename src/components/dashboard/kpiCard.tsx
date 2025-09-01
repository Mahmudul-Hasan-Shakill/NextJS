// components/dashboard/KpiCard.tsx
"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Accent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate";

const ACCENT = {
  violet: {
    bar: "bg-violet-500",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    wash: "from-violet-500/10",
    ring: "ring-violet-500/20",
  },
  emerald: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    wash: "from-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  amber: {
    bar: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    wash: "from-amber-500/10",
    ring: "ring-amber-500/20",
  },
  rose: {
    bar: "bg-rose-500",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    wash: "from-rose-500/10",
    ring: "ring-rose-500/20",
  },
  cyan: {
    bar: "bg-cyan-500",
    chip: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    wash: "from-cyan-500/10",
    ring: "ring-cyan-500/20",
  },
  blue: {
    bar: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    wash: "from-blue-500/10",
    ring: "ring-blue-500/20",
  },
  slate: {
    bar: "bg-slate-500",
    chip: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    wash: "from-slate-500/10",
    ring: "ring-slate-500/20",
  },
} as const;

export default function KpiCard({
  label,
  value,
  subtitle,
  icon,
  accent = "violet",
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: Accent;
}) {
  const a = ACCENT[accent];

  return (
    <div
      className={clsx(
        "relative group overflow-hidden rounded-2xl border bg-white dark:bg-zinc-950",
        "shadow-sm hover:shadow-md transition-all",
        "ring-1 hover:ring-2",
        a.ring
      )}
    >
      {/* Left accent bar */}
      <div className={clsx("absolute left-0 top-0 h-full w-1.5", a.bar)} />

      {/* Soft gradient wash */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 opacity-90",
          "bg-gradient-to-br",
          a.wash,
          "via-transparent to-transparent"
        )}
      />

      {/* Content */}
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="text-[11px] font-medium text-muted-foreground">
            {label}
          </div>
          {icon ? (
            <div
              className={clsx(
                "shrink-0 rounded-xl p-2",
                "border border-transparent",
                a.chip
              )}
              aria-hidden
            >
              {icon}
            </div>
          ) : null}
        </div>

        <div className="mt-2 text-3xl font-semibold leading-none tracking-tight">
          {value}
        </div>

        {subtitle ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
