"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePhysicalHost } from "@/hooks/core_systems/physical_host/physicalHostHooks";

/* ------------------------------- utils ------------------------------- */
const norm = (s?: string | null) => (s || "").trim();
const low = (s?: string | null) => norm(s).toLowerCase();
const parseDate = (d?: string | Date | null) =>
  !d ? null : d instanceof Date ? d : new Date(d);
const withinDays = (dt: Date | null, days: number) =>
  !!dt && (dt.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= days; // expiry in the future within N days

/** Suspense helper (optional, only if your hook exposes `isLoading`) */
function useLoadingSuspense(isLoading?: boolean) {
  const pendingRef = useRef<{ p: Promise<void> | null; resolve?: () => void }>({
    p: null,
  });

  useEffect(() => {
    if (!isLoading && pendingRef.current.p) {
      pendingRef.current.resolve?.();
      pendingRef.current.p = null;
      pendingRef.current.resolve = undefined;
    }
  }, [isLoading]);

  if (isLoading) {
    if (!pendingRef.current.p) {
      pendingRef.current.p = new Promise<void>((res) => {
        pendingRef.current.resolve = res;
      });
    }
    throw pendingRef.current.p;
  }
}

function useHostsWithOptionalSuspense() {
  const { physicalHosts, isLoading }: any = usePhysicalHost();
  useLoadingSuspense(typeof isLoading === "boolean" ? isLoading : false);
  return (physicalHosts as Array<any>) || [];
}

/* ------------------------------- main API ------------------------------- */
export function usePhysicalData() {
  const hosts = useHostsWithOptionalSuspense();

  const kpis = useMemo(() => {
    const totalServers = hosts.filter((h) => !!norm(h.hostname)).length;

    const warrantyExpiring = hosts.filter((h) => {
      const dt = parseDate(h.warrantyExpiry);
      // count items expiring within next 30 days (and in the future)
      return !!dt && dt.getTime() >= Date.now() && withinDays(dt, 30);
    }).length;

    const psDual = hosts.filter((h) => low(h.powerSupply) === "dual").length;
    const psSingle = hosts.filter(
      (h) => low(h.powerSupply) === "single"
    ).length;

    return { totalServers, warrantyExpiring, psDual, psSingle };
  }, [hosts]);

  const charts = useMemo(() => {
    const mkCounts = (acc: Record<string, number>, key: string) => {
      const k = norm(key) || "Unknown";
      acc[k] = (acc[k] || 0) + 1;
    };

    const byCluster: Record<string, number> = {};
    const byBrand: Record<string, number> = {};
    const byStorageType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byLocation: Record<string, number> = {};
    const byOsVersion: Record<string, number> = {};

    hosts.forEach((h) => {
      mkCounts(byCluster, h.clusterName);
      mkCounts(byBrand, h.brand);
      mkCounts(byStorageType, h.storageType);
      mkCounts(byStatus, h.status);
      mkCounts(byLocation, h.location);
      mkCounts(byOsVersion, h.osVersion);
    });

    const clusterPie = Object.entries(byCluster).map(([name, value]) => ({
      name,
      value,
    }));
    const brandDonut = Object.entries(byBrand).map(([name, value]) => ({
      name,
      value,
    }));
    const storageTypePie = Object.entries(byStorageType).map(
      ([name, value]) => ({ name, value })
    );
    const statusPie = Object.entries(byStatus).map(([name, value]) => ({
      name,
      value,
    }));
    const locationBar = Object.entries(byLocation).map(([name, value]) => ({
      name,
      value,
    }));
    const osVersionBar = Object.entries(byOsVersion).map(([name, value]) => ({
      name,
      value,
    }));

    const brandTotal = brandDonut.reduce((s, r) => s + r.value, 0);

    return {
      clusterPie,
      brandDonut,
      brandTotal,
      storageTypePie,
      statusPie,
      locationBar,
      osVersionBar,
    };
  }, [hosts]);

  return { kpis, charts };
}

/* --------------------- optional per-widget hooks --------------------- */
export function usePhTotalServers() {
  const hosts = useHostsWithOptionalSuspense();
  return hosts.filter((h) => !!norm(h.hostname)).length;
}

export function usePhWarrantyExpiring(days = 30) {
  const hosts = useHostsWithOptionalSuspense();
  return hosts.filter((h) => {
    const dt = parseDate(h.warrantyExpiry);
    return !!dt && dt.getTime() >= Date.now() && withinDays(dt, days);
  }).length;
}

export function usePhPowerSupply(type: "dual" | "single") {
  const hosts = useHostsWithOptionalSuspense();
  return hosts.filter((h) => low(h.powerSupply) === type).length;
}
