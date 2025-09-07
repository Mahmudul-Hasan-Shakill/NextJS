// src/components/dashboard/backup/backup.data.ts
"use client";

import { useMemo } from "react";
import { useAllFilesystems } from "@/hooks/core_systems/filesystem/useAllFilesystems";

const norm = (s?: string | null) => (s || "").trim();
const low = (s?: string | null) => norm(s).toLowerCase();

const WEEK_NAMES: Array<{ full: string; short: string; idx: number }> = [
  { full: "Sunday", short: "Sun", idx: 0 },
  { full: "Monday", short: "Mon", idx: 1 },
  { full: "Tuesday", short: "Tue", idx: 2 },
  { full: "Wednesday", short: "Wed", idx: 3 },
  { full: "Thursday", short: "Thu", idx: 4 },
  { full: "Friday", short: "Fri", idx: 5 },
  { full: "Saturday", short: "Sat", idx: 6 },
];
const WEEK_LABELS = WEEK_NAMES.map((w) => w.full); // ["Sunday", "Monday", ...]

// Map weekday token -> index
function weekdayIndex(token: string): number | null {
  const t = low(token);
  const found = WEEK_NAMES.find((w) => low(w.full) === t || low(w.short) === t);
  return found ? found.idx : null;
}

export function useBackupData() {
  const { filesystems } = useAllFilesystems();

  const kpis = useMemo(() => {
    // Unique applications & clients
    const appSet = new Set<string>();
    const clientSet = new Set<string>();

    (filesystems || []).forEach((f: any) => {
      const app = norm(f.application);
      if (app) appSet.add(app);

      const node = norm((f.node as string) || (f.node_name as string));
      if (node) clientSet.add(node);
    });

    return {
      totalApplications: appSet.size,
      totalClients: clientSet.size,
    };
  }, [filesystems]);

  const charts = useMemo(() => {
    const byEnv: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byOs: Record<string, number> = {};

    // Weekly (Sun..Sat), Monthly (1..31)
    const weekly = Array(7).fill(0) as number[];
    const monthly = Array(31).fill(0) as number[];

    (filesystems || []).forEach((f: any) => {
      // groupers
      const env = norm(f.backupEnvironment) || "Unknown";
      byEnv[env] = (byEnv[env] || 0) + 1;

      const btype = norm(f.backupType) || "Unknown";
      byType[btype] = (byType[btype] || 0) + 1;

      const os = norm(f.os) || "Unknown";
      byOs[os] = (byOs[os] || 0) + 1;

      // schedule parsing
      const raw = norm(f.backupSchedule);
      if (!raw) return;
      const tokens = raw
        .split(",")
        .map((t: string) => norm(t))
        .filter(Boolean);

      tokens.forEach((tok: string) => {
        // If it's an integer 1..31 -> monthly
        const n = Number(tok);
        if (!Number.isNaN(n) && n >= 1 && n <= 31) {
          monthly[n - 1] += 1;
          return;
        }
        // Else try weekday name
        const wi = weekdayIndex(tok);
        if (wi !== null) {
          weekly[wi] += 1;
        }
      });
    });

    const envPie = Object.entries(byEnv).map(([name, value]) => ({
      name,
      value,
    }));
    const typeDonut = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));
    const osBar = Object.entries(byOs).map(([name, value]) => ({
      name,
      value,
    }));

    const scheduleWeeklyBar = WEEK_LABELS.map((name, i) => ({
      name,
      value: weekly[i],
    }));

    const scheduleMonthlyBar = Array.from({ length: 31 }, (_, i) => ({
      name: String(i + 1),
      value: monthly[i],
    }));

    return {
      envPie,
      typeDonut,
      osBar,
      scheduleWeeklyBar,
      scheduleMonthlyBar,
    };
  }, [filesystems]);

  return { kpis, charts };
}
