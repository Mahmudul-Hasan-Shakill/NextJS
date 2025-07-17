"use client";

import { useAllVms } from "@/hooks/core_systems/vm/useGetAllVms";
import { PieChartComponent } from "./pieChartComponent";
import { DonutChartComponent } from "./donutChartComponent";
import { BarChartComponent } from "./barChartComponent";
export const VmServerCharts = () => {
  const { vms } = useAllVms();

  const vmCounts = vms.reduce((acc: Record<string, number>, vm) => {
    const serverType = vm.serverType || "Unknown";
    acc[serverType] = (acc[serverType] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(vmCounts).map(([vm, count]) => ({
    name: vm,
    value: count,
  }));

  const osCounts = vms.reduce((acc: Record<string, number>, os) => {
    const platform = os.platform || "Unknown";
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  const donutChartData = Object.entries(osCounts).map(([os, count]) => ({
    name: os,
    value: count,
  }));

  
  const versionCounts = vms.reduce((acc: Record<string, number>, os) => {
    const osVersion = os.osVersion || "Unknown";
    acc[osVersion] = (acc[osVersion] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(versionCounts).map(([version, count]) => ({
    name: version,
    value: count,
  }));

  return (
    <div className="space-y-8 p-12">
      {/* Pie & Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-base font-semibold text-center text-foreground mb-4">
            Server Types
          </h2>
          <div className="flex justify-center items-center">
            <PieChartComponent data={pieChartData} />
          </div>
        </div>

        <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-base font-semibold text-center text-foreground mb-4">
            OS Types
          </h2>
          <div className="flex justify-center items-center">
            <DonutChartComponent data={donutChartData} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg border border-muted bg-muted/30 dark:bg-muted/20 p-6 shadow-sm hover:shadow-md transition-all">
        <h2 className="text-base font-semibold text-center text-foreground mb-4">
          OS Versions
        </h2>
        <div className="flex justify-center items-center">
          <BarChartComponent data={barChartData} />
        </div>
      </div>
    </div>
  );
};
