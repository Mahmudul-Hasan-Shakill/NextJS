// src/components/dashboard/vm/vm.data.ts
"use client";
import { useMemo } from "react";
import { useAllAutomations } from "@/hooks/core_systems/automation/useAllAutomations";

const norm = (s?: string | null) => (s || "").trim();
const low = (s?: string | null) => norm(s).toLowerCase();
const parseDate = (d?: string | Date | null) =>
  !d ? null : d instanceof Date ? d : new Date(d);
const withinDays = (dt: Date | null, days: number) =>
  !!dt && (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24) <= days;

export function useVmData() {
  const { automations } = useAllAutomations();

  const kpis = useMemo(() => {
    const total = automations.length;
    const falconInstalled = automations.filter(
      (x) => low(x.falconInstalled) === "installed"
    ).length;
    const qualysInstalled = automations.filter(
      (x) => low(x.qualysInstalled) === "installed"
    ).length;
    const ntpActive = automations.filter((x) => {
      const s = low(x.ntpService);
      return s === "active" || s === "enabled" || s === "running";
    }).length;
    const patchedRecent = automations.filter((x) =>
      withinDays(parseDate(x.lastPatchInstalled), 30)
    ).length;

    return {
      total,
      falconInstalled,
      qualysInstalled,
      ntpActive,
      patchedRecent,
    };
  }, [automations]);

  const charts = useMemo(() => {
    const byEnv: Record<string, number> = {};
    const byPlatform: Record<string, number> = {};
    const byVersion: Record<string, number> = {};

    automations.forEach((a) => {
      const env = norm(a.serverEnvironment) || "Unknown";
      const plat = norm(a.serverPlatform) || "Unknown";
      const ver = norm(a.osVersion) || "Unknown";
      byEnv[env] = (byEnv[env] || 0) + 1;
      byPlatform[plat] = (byPlatform[plat] || 0) + 1;
      byVersion[ver] = (byVersion[ver] || 0) + 1;
    });

    const envPie = Object.entries(byEnv).map(([name, value]) => ({
      name,
      value,
    }));
    const platformDonut = Object.entries(byPlatform).map(([name, value]) => ({
      name,
      value,
    }));
    const osVersionBar = Object.entries(byVersion).map(([name, value]) => ({
      name,
      value,
    }));

    return { envPie, platformDonut, osVersionBar };
  }, [automations]);

  return { kpis, charts };
}
