// src/dashboard/core/tabRegistry.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

// Server Dashboard (your full widgets/drag/drop system)
const ServerDashboard = dynamic(
  () => import("@/components/dashboard/vm/vm.dashboard"),
  { ssr: false }
);

const PhysicalDashboard = dynamic(
  () => import("@/components/dashboard/physical/physical.dashboard"),
  { ssr: false }
);

const BackupDashboard = dynamic(
  () => import("@/components/dashboard/backup/backup.dashboard"),
  { ssr: false }
);

const HomeDashboard = dynamic(
  () => import("@/components/dashboard/home/home.dashboard"),
  { ssr: false }
);

const AmcDashboard = dynamic(
  () => import("@/components/dashboard/amc/amc.dashboard"),
  { ssr: false }
);

function Placeholder({ title }: { title: string }) {
  return (
    <div className="w-full rounded-2xl border bg-white dark:bg-zinc-950 p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        This area is ready for a dedicated widget dashboard like the Server tab.
      </p>
    </div>
  );
}

/**
 * Map backend tab keys → components.
 * Keep labels in the backend; keys must match what you seeded there.
 */
export const TAB_COMPONENTS: Record<string, React.ReactNode> = {
  dashboard: <HomeDashboard />,
  vm_server: <ServerDashboard />,
  physical_host: <PhysicalDashboard />,
  backup: <BackupDashboard />,
  amc: <AmcDashboard />,
  network: <Placeholder title="Network" />,
  system_admin: <Placeholder title="System Admin" />,
  database: <Placeholder title="Database" />,
};
