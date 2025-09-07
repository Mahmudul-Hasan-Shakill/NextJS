// src/components/dashboard/vm/vm.dashboard.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, X } from "lucide-react";

import WidgetFrame from "@/components/dashboard/core/widgetFrame";
import KpiCard from "@/components/dashboard/core/kpiCard";
import AddWidgetDialog from "@/components/dashboard/core/addWidgetDialog";
import ReorderableGrid from "@/components/dashboard/core/reorderableGrid";

import { PieChartComponent } from "@/components/dashboard/charts/pieChartComponent";
import { DonutChartComponent } from "@/components/dashboard/charts/donutChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/barChartComponent";
import { useVmData } from "./vm.data";
import {
  VM_WIDGETS,
  VM_DEFAULT_LAYOUT,
  VM_ALLOWED_TYPES,
  VmWidgetType,
  VmWidgetInstance,
  VmLayout,
  VmAccent,
} from "./vm.types";
import { useDashboardLayout } from "../core/useDashboardLayout";
import SpinnerLoader from "@/components/loader/spinnerLoader";

/* ------------------- Suspense fallbacks (tiny helpers) ------------------- */
function KpiFallback() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-zinc-950 p-5 h-[108px]">
      <div className="h-3 w-24 bg-muted rounded mb-3" />
      <div className="h-7 w-28 bg-muted rounded mb-2" />
      <div className="h-3 w-40 bg-muted rounded" />
    </div>
  );
}

function ChartFallback({ height = 320 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-2xl border bg-white dark:bg-zinc-950 grid place-items-center"
      style={{ height }}
    >
      <SpinnerLoader />
    </div>
  );
}

export default function VmDashboard() {
  const { kpis, charts } = useVmData();

  const { layout, setLayout, addWidget, removeWidget, reset } =
    useDashboardLayout<VmWidgetType>({
      storageKey: "dash_vm_v1",
      allWidgets: VM_WIDGETS,
      allowedTypes: VM_ALLOWED_TYPES,
      defaultLayout: VM_DEFAULT_LAYOUT,
    });

  const reorder = (section: keyof VmLayout, next: VmWidgetInstance[]) =>
    setLayout((prev) => ({ ...prev, [section]: next }));

  /* ----------------------------- KPI renderer ----------------------------- */
  const renderKpi = (w: VmWidgetInstance) => {
    switch (w.type) {
      case "Total_servers":
        return (
          <Suspense fallback={<KpiFallback />}>
            <KpiCard
              label="Total Servers"
              value={kpis.total}
              accent={w.accent || "violet"}
              subtitle="All automation records"
            />
          </Suspense>
        );
      case "Falcon_Installed":
        return (
          <Suspense fallback={<KpiFallback />}>
            <KpiCard
              label="Falcon Installed"
              value={kpis.falconInstalled}
              accent={w.accent || "amber"}
              subtitle="Installed = True"
            />
          </Suspense>
        );
      case "Qualys_Installed":
        return (
          <Suspense fallback={<KpiFallback />}>
            <KpiCard
              label="Qualys Installed"
              value={kpis.qualysInstalled}
              accent={w.accent || "slate"}
              subtitle="Installed = True"
            />
          </Suspense>
        );
      case "NTP_Active":
        return (
          <Suspense fallback={<KpiFallback />}>
            <KpiCard
              label="NTP Active"
              value={kpis.ntpActive}
              accent={w.accent || "blue"}
              subtitle="NTP Service = Running"
            />
          </Suspense>
        );
      case "Patched":
        return (
          <Suspense fallback={<KpiFallback />}>
            <KpiCard
              label="Patched (≤ 30 days)"
              value={kpis.patchedRecent}
              accent={w.accent || "emerald"}
              subtitle="Patching completed < 30 days ago"
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  /* ---------------------------- Chart renderers --------------------------- */
  const renderChartTop = (w: VmWidgetInstance) => {
    switch (w.type) {
      case "Server_Environment":
        return (
          <WidgetFrame
            title="Environment"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as VmAccent) || "indigo"}
          >
            <Suspense fallback={<ChartFallback height={320} />}>
              <div className="h-[320px]">
                <PieChartComponent data={charts.envPie} />
              </div>
            </Suspense>
          </WidgetFrame>
        );
      case "Server_Platform":
        return (
          <WidgetFrame
            title="Platform"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as VmAccent) || "blue"}
          >
            <Suspense fallback={<ChartFallback height={320} />}>
              <div className="h-[320px]">
                <DonutChartComponent data={charts.platformDonut} />
              </div>
            </Suspense>
          </WidgetFrame>
        );
      default:
        return null;
    }
  };

  const renderChartBottom = (w: VmWidgetInstance) =>
    w.type === "OS_Versions" ? (
      <WidgetFrame
        title="OS Versions"
        onRemove={() => removeWidget(w.id)}
        accent={(w.accent as VmAccent) || "violet"}
      >
        <Suspense fallback={<ChartFallback height={360} />}>
          <div className="h-[360px]">
            <BarChartComponent data={charts.osVersionBar} />
          </div>
        </Suspense>
      </WidgetFrame>
    ) : null;

  const [addOpen, setAddOpen] = useState(false);

  /* --------------------------------- UI --------------------------------- */
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex gap-2 justify-end">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Widget
        </Button>
        <Button size="sm" variant="secondary" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <ReorderableGrid
        items={layout.kpis}
        onReorder={(next) => reorder("kpis", next)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        renderItem={(w) => (
          <div className="relative group">
            <button
              onClick={() => removeWidget(w.id)}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-background border shadow p-1 hover:bg-muted opacity-0 group-hover:opacity-100 transition"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
            {renderKpi(w)}
          </div>
        )}
      />

      <ReorderableGrid
        items={layout.chartsTop}
        onReorder={(next) => reorder("chartsTop", next)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        renderItem={(w) => <div className="w-full">{renderChartTop(w)}</div>}
      />

      <ReorderableGrid
        items={layout.chartsBottom}
        onReorder={(next) => reorder("chartsBottom", next)}
        className="grid grid-cols-1 gap-4"
        renderItem={(w) => <div className="w-full">{renderChartBottom(w)}</div>}
      />

      <AddWidgetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingTypes={[
          ...layout.kpis.map((x) => x.type),
          ...layout.chartsTop.map((x) => x.type),
          ...layout.chartsBottom.map((x) => x.type),
        ]}
        onAdd={addWidget}
        allWidgets={VM_WIDGETS}
      />
    </div>
  );
}
