// "use client";

// import { useAllVms } from "@/hooks/core_systems/vm/useGetAllVms";
// import { PieChartComponent } from "./pieChartComponent";
// import { DonutChartComponent } from "./donutChartComponent";
// import { BarChartComponent } from "./barChartComponent";
// export const VmServerCharts = () => {
//   const { vms } = useAllVms();

//   const vmCounts = vms.reduce((acc: Record<string, number>, vm) => {
//     const serverType = vm.serverType || "Unknown";
//     acc[serverType] = (acc[serverType] || 0) + 1;
//     return acc;
//   }, {});

//   const pieChartData = Object.entries(vmCounts).map(([vm, count]) => ({
//     name: vm,
//     value: count,
//   }));

//   const osCounts = vms.reduce((acc: Record<string, number>, os) => {
//     const platform = os.platform || "Unknown";
//     acc[platform] = (acc[platform] || 0) + 1;
//     return acc;
//   }, {});

//   const donutChartData = Object.entries(osCounts).map(([os, count]) => ({
//     name: os,
//     value: count,
//   }));

//   const versionCounts = vms.reduce((acc: Record<string, number>, os) => {
//     const osVersion = os.osVersion || "Unknown";
//     acc[osVersion] = (acc[osVersion] || 0) + 1;
//     return acc;
//   }, {});

//   const barChartData = Object.entries(versionCounts).map(([version, count]) => ({
//     name: version,
//     value: count,
//   }));

//   return (
//     <div className="space-y-8 p-12">
//       {/* Pie & Donut Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
//           <h2 className="text-base font-semibold text-center text-foreground mb-4">
//             Server Types
//           </h2>
//           <div className="flex justify-center items-center">
//             <PieChartComponent data={pieChartData} />
//           </div>
//         </div>

//         <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
//           <h2 className="text-base font-semibold text-center text-foreground mb-4">
//             OS Types
//           </h2>
//           <div className="flex justify-center items-center">
//             <DonutChartComponent data={donutChartData} />
//           </div>
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
//         <h2 className="text-base font-semibold text-center text-foreground mb-4">
//           OS Versions
//         </h2>
//         <div className="flex justify-center items-center">
//           <BarChartComponent data={barChartData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// components/charts/userVmCharts.tsx
"use client";

import { useAllVms } from "@/hooks/core_systems/vm/useGetAllVms";
import KpiCard from "@/components/dashboard/kpiCard";
import { PieChartComponent } from "./pieChartComponent"; // ← your original
import { DonutChartComponent } from "./donutChartComponent"; // ← your original
import { BarChartComponent } from "./barChartComponent"; // ← updated (above)
import { Play, PauseCircle, Server, ShieldCheck } from "lucide-react";

export const VmServerCharts = () => {
  const { vms } = useAllVms();

  // ---- KPI numbers
  const total = vms.length;
  const running = vms.filter((x) => x.serverStatus === "Running").length;
  const stopped = vms.filter((x) => x.serverStatus === "Stopped").length;

  // simple compliance (≤ 30 days since lastPatchingDate)
  const now = Date.now();
  const compliant = vms.filter((x) => {
    if (!x.lastPatchingDate) return false;
    const d = new Date(x.lastPatchingDate).getTime();
    return !Number.isNaN(d) && now - d <= 30 * 24 * 3600 * 1000;
  }).length;
  const compliancePct = total ? Math.round((compliant / total) * 100) : 0;

  // ---- Pie: server types
  const vmCounts = vms.reduce((acc: Record<string, number>, vm) => {
    const serverType = vm.serverType || "Unknown";
    acc[serverType] = (acc[serverType] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.entries(vmCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // ---- Donut: platforms
  const osCounts = vms.reduce((acc: Record<string, number>, vm) => {
    const platform = vm.platform || "Unknown";
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});
  const donutChartData = Object.entries(osCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // ---- Bar: OS versions (full-width)
  const versionCounts = vms.reduce((acc: Record<string, number>, vm) => {
    const osVersion = vm.osVersion || "Unknown";
    acc[osVersion] = (acc[osVersion] || 0) + 1;
    return acc;
  }, {});
  const barChartData = Object.entries(versionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-8 p-6 md:p-10">
      {/* KPI row — roomy, spans maximum width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          label="Total Servers"
          value={total}
          subtitle="All active inventory"
          icon={<Server className="w-4 h-4" />}
        />
        <KpiCard
          label="Running"
          value={running}
          subtitle="Currently up"
          icon={<Play className="w-4 h-4" />}
        />
        <KpiCard
          label="Stopped"
          value={stopped}
          subtitle="Currently down"
          icon={<PauseCircle className="w-4 h-4" />}
        />
        <KpiCard
          label="Patch Compliance"
          value={`${compliancePct}%`}
          subtitle="Patched ≤ 30 days"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Row 2: Pie + Donut (side-by-side like earlier, just nicer containers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Server Types
          </h2>
          <div className="flex justify-center items-center">
            <PieChartComponent data={pieChartData} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-5 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            OS Platforms
          </h2>
          <div className="flex justify-center items-center">
            <DonutChartComponent data={donutChartData} />
          </div>
        </div>
      </div>

      {/* Row 3: full-width bar chart */}
      <BarChartComponent
        data={barChartData}
        height={420}
        title="OS Versions (All)"
      />
    </div>
  );
};
