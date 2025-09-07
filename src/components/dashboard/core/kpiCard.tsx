// // src/components/dashboard/core/kpiCard.tsx
// "use client";

// import { ReactNode } from "react";
// import clsx from "clsx";
// import type { Accent } from "./types"; // ✅ use the shared Accent that includes "indigo"

// const ACCENT: Record<
//   Accent,
//   { bar: string; chip: string; wash: string; ring: string }
// > = {
//   violet: {
//     bar: "bg-violet-500",
//     chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
//     wash: "from-violet-500/10",
//     ring: "ring-violet-500/20",
//   },
//   emerald: {
//     bar: "bg-emerald-500",
//     chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
//     wash: "from-emerald-500/10",
//     ring: "ring-emerald-500/20",
//   },
//   amber: {
//     bar: "bg-amber-500",
//     chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
//     wash: "from-amber-500/10",
//     ring: "ring-amber-500/20",
//   },
//   rose: {
//     bar: "bg-rose-500",
//     chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
//     wash: "from-rose-500/10",
//     ring: "ring-rose-500/20",
//   },
//   cyan: {
//     bar: "bg-cyan-500",
//     chip: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
//     wash: "from-cyan-500/10",
//     ring: "ring-cyan-500/20",
//   },
//   blue: {
//     bar: "bg-blue-500",
//     chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
//     wash: "from-blue-500/10",
//     ring: "ring-blue-500/20",
//   },
//   slate: {
//     bar: "bg-slate-500",
//     chip: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
//     wash: "from-slate-500/10",
//     ring: "ring-slate-500/20",
//   },
//   // ✅ add indigo to keep parity with WidgetFrame defaults
//   indigo: {
//     bar: "bg-indigo-500",
//     chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
//     wash: "from-indigo-500/10",
//     ring: "ring-indigo-500/20",
//   },
// };

// export default function KpiCard({
//   label,
//   value,
//   subtitle,
//   icon,
//   accent = "violet",
// }: {
//   label: string;
//   value: string | number;
//   subtitle?: string;
//   icon?: ReactNode;
//   accent?: Accent;
// }) {
//   const a = ACCENT[accent];

//   return (
//     <div
//       className={clsx(
//         "relative group overflow-hidden rounded-2xl border bg-white dark:bg-zinc-950",
//         "shadow-sm hover:shadow-md transition-all",
//         "ring-1 hover:ring-2",
//         a.ring
//       )}
//     >
//       {/* Left accent bar */}
//       <div className={clsx("absolute left-0 top-0 h-full w-1.5", a.bar)} />

//       {/* Soft gradient wash */}
//       <div
//         className={clsx(
//           "pointer-events-none absolute inset-0 opacity-90",
//           "bg-gradient-to-br",
//           a.wash,
//           "via-transparent to-transparent"
//         )}
//       />

//       {/* Content */}
//       <div className="relative p-5">
//         <div className="flex items-start justify-between">
//           <div className="text-[14px] font-medium text-muted-foreground">
//             {label}
//           </div>
//           {icon ? (
//             <div
//               className={clsx(
//                 "shrink-0 rounded-xl p-2",
//                 "border border-transparent",
//                 a.chip
//               )}
//               aria-hidden
//             >
//               {icon}
//             </div>
//           ) : null}
//         </div>

//         <div className="mt-2 text-3xl font-semibold leading-none tracking-tight">
//           {value}
//         </div>

//         {subtitle ? (
//           <div className="mt-1 text-[11px] text-muted-foreground">
//             {subtitle}
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// src/components/dashboard/core/kpiCard.tsx
"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import type { Accent } from "./types";

const ACCENT: Record<
  Accent,
  {
    bar: string;
    chip: string;
    wash: string;
    ring: string;
    bg: string;
    text: string;
  }
> = {
  violet: {
    bar: "bg-violet-500",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    wash: "from-violet-500/10",
    ring: "ring-violet-500/20",
    bg: "bg-violet-200 dark:bg-violet-100", // ⬅️ darker than 50
    text: "text-violet-800 dark:text-white",
  },
  emerald: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    wash: "from-emerald-500/10",
    ring: "ring-emerald-500/20",
    bg: "bg-emerald-200 dark:bg-emerald-100",
    text: "text-emerald-800 dark:text-white",
  },
  amber: {
    bar: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    wash: "from-amber-500/10",
    ring: "ring-amber-500/20",
    bg: "bg-amber-200 dark:bg-amber-100",
    text: "text-amber-800 dark:text-white",
  },
  rose: {
    bar: "bg-rose-500",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    wash: "from-rose-500/10",
    ring: "ring-rose-500/20",
    bg: "bg-rose-200 dark:bg-rose-100",
    text: "text-rose-800 dark:text-white",
  },
  cyan: {
    bar: "bg-cyan-500",
    chip: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    wash: "from-cyan-500/10",
    ring: "ring-cyan-500/20",
    bg: "bg-cyan-200 dark:bg-cyan-100",
    text: "text-cyan-800 dark:text-white",
  },
  blue: {
    bar: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    wash: "from-blue-500/10",
    ring: "ring-blue-500/20",
    bg: "bg-blue-200 dark:bg-blue-100",
    text: "text-blue-800 dark:text-white",
  },
  slate: {
    bar: "bg-slate-500",
    chip: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    wash: "from-slate-500/10",
    ring: "ring-slate-500/20",
    bg: "bg-slate-200 dark:bg-slate-100",
    text: "text-slate-800 dark:text-white",
  },
  indigo: {
    bar: "bg-indigo-500",
    chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    wash: "from-indigo-500/10",
    ring: "ring-indigo-500/20",
    bg: "bg-indigo-200 dark:bg-indigo-100",
    text: "text-indigo-800 dark:text-white",
  },
};

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
        "relative group overflow-hidden rounded-2xl border",
        "shadow-sm hover:shadow-md transition-all",
        "ring-1 hover:ring-2",
        a.ring,
        a.bg, // ✅ light mode background
        "dark:bg-zinc-950" // ✅ dark mode unchanged
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
          <div className={clsx("text-[14px] font-medium", a.text)}>{label}</div>
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

        <div
          className={clsx(
            "mt-2 text-3xl font-semibold leading-none tracking-tight",
            a.text
          )}
        >
          {value}
        </div>

        {subtitle ? (
          <div className={clsx("mt-1 text-[11px]", a.text)}>{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}
