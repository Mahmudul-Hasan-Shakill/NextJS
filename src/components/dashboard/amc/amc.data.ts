// src/components/dashboard/amc/amc.data.ts
"use client";

import { useMemo } from "react";
import { useAllAmc } from "@/hooks/core_systems/amc/useAmc";

const norm = (s?: string | null) => (s || "").trim();
const parseDate = (d?: string | null) => (d ? new Date(d) : null);

function daysUntil(date: Date | null) {
  if (!date) return Infinity;
  const ms = date.getTime() - Date.now();
  return ms / (1000 * 60 * 60 * 24);
}

export function useAmcData() {
  const { amcRecords } = useAllAmc();

  const kpis = useMemo(() => {
    const total = amcRecords.length;
    const active = amcRecords.filter((x) => x.isActive === true).length;

    const expiringSoon = amcRecords.filter((x) => {
      const d = parseDate(x.amcEnd);
      const days = daysUntil(d);
      return days >= 0 && days <= 30;
    }).length;

    const eolEosl = amcRecords.filter((x) => x.isEolOrEosl === true).length;

    return { total, active, expiringSoon, eolEosl };
  }, [amcRecords]);

  const charts = useMemo(() => {
    const byVendor: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const bySupport: Record<string, number> = {};
    let activeCount = 0;
    let inactiveRetiredCount = 0;
    let eolCount = 0;
    let supportedCount = 0;

    amcRecords.forEach((r) => {
      const vendor = norm(r.vendorName) || "Unknown";
      const status = norm(r.status) || "Unknown";
      const support = norm(r.supportType) || "Unknown";

      byVendor[vendor] = (byVendor[vendor] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;
      bySupport[support] = (bySupport[support] || 0) + 1;

      if (r.isActive) activeCount += 1;
      else inactiveRetiredCount += 1;

      if (r.isEolOrEosl) eolCount += 1;
      else supportedCount += 1;
    });

    const vendorBar = Object.entries(byVendor).map(([name, value]) => ({
      name,
      value,
    }));

    const statusBar = Object.entries(byStatus).map(([name, value]) => ({
      name,
      value,
    }));

    const supportTypeBar = Object.entries(bySupport).map(([name, value]) => ({
      name,
      value,
    }));

    const statusDonut = [
      { name: "Active", value: activeCount },
      { name: "Inactive/Retired", value: inactiveRetiredCount },
    ];

    const vendorPie = Object.entries(byVendor).map(([name, value]) => ({
      name,
      value,
    }));

    const eolDonut = [
      { name: "EOL/EOSL", value: eolCount },
      { name: "Supported", value: supportedCount },
    ];

    return {
      vendorBar,
      statusBar,
      supportTypeBar,
      statusDonut,
      vendorPie,
      eolDonut,
    };
  }, [amcRecords]);

  return { kpis, charts };
}
