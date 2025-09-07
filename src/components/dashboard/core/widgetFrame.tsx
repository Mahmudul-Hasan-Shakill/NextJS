// src/components/dashboard/core/WidgetFrame.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Accent } from "./types";

const accentTopBar: Record<Accent, string> = {
  violet: "from-violet-500/90 to-violet-500/30",
  emerald: "from-emerald-500/90 to-emerald-500/30",
  rose: "from-rose-500/90 to-rose-500/30",
  slate: "from-slate-500/90 to-slate-500/30",
  cyan: "from-cyan-500/90 to-cyan-500/30",
  blue: "from-blue-500/90 to-blue-500/30",
  amber: "from-amber-500/90 to-amber-500/30",
  indigo: "from-indigo-500/90 to-indigo-500/30",
};

export default function WidgetFrame({
  title,
  onRemove,
  children,
  accent = "indigo",
}: {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
  accent?: Accent;
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border bg-white dark:bg-zinc-950">
      <div
        className={`pointer-events-none absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${accentTopBar[accent]}`}
      />
      <div className="flex items-center justify-between px-4 py-1 border-b">
        <div className="text-sm font-semibold">{title}</div>
        {onRemove ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onRemove}
            title="Remove"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}
