"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, X } from "lucide-react";

import WidgetFrame from "@/components/dashboard/core/widgetFrame";
import KpiCard from "@/components/dashboard/core/kpiCard";
import AddWidgetDialog from "@/components/dashboard/core/addWidgetDialog";
import ReorderableGrid from "@/components/dashboard/core/reorderableGrid";

import { PieChartComponent } from "@/components/dashboard/charts/pieChartComponent";
import { DonutChartComponent } from "@/components/dashboard/charts/donutChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/barChartComponent";
import SpinnerLoader from "@/components/loader/spinnerLoader";

import { useDashboardLayout } from "../core/useDashboardLayout";
import {
  PHYSICAL_WIDGETS,
  PHYSICAL_DEFAULT_LAYOUT,
  PHYSICAL_ALLOWED_TYPES,
  PhysicalWidgetType,
  PhysicalWidgetInstance,
  PhysicalLayout,
  PhysicalAccent,
} from "./physical.types";
import { usePhysicalData } from "./physical.data";

export default function PhysicalDashboard() {
  const { kpis, charts } = usePhysicalData();

  const { layout, setLayout, addWidget, removeWidget, reset } =
    useDashboardLayout<PhysicalWidgetType>({
      storageKey: "dash_physical_v1",
      allWidgets: PHYSICAL_WIDGETS,
      allowedTypes: PHYSICAL_ALLOWED_TYPES,
      defaultLayout: PHYSICAL_DEFAULT_LAYOUT,
    });

  const reorder = (section: keyof PhysicalLayout, next: any[]) =>
    setLayout((prev) => ({
      ...prev,
      [section]: next as PhysicalWidgetInstance[],
    }));

  const renderKpi = (w: PhysicalWidgetInstance) => {
    switch (w.type) {
      case "PH_TotalServers":
        return (
          <Suspense fallback={<SpinnerLoader />}>
            <KpiCard
              label="Total Servers"
              value={kpis.totalServers}
              accent={w.accent || "violet"}
              subtitle="Count of unique hostnames"
            />
          </Suspense>
        );
      case "PH_WarrantyExpiring":
        return (
          <Suspense fallback={<SpinnerLoader />}>
            <KpiCard
              label="Warranty Expiring (≤ 30d)"
              value={kpis.warrantyExpiring}
              accent={w.accent || "rose"}
              subtitle="Within next 30 days"
            />
          </Suspense>
        );
      case "PH_PowerSupply_Dual":
        return (
          <KpiCard
            label="Power Supply: Dual"
            value={kpis.psDual}
            accent={w.accent || "emerald"}
            subtitle='powerSupply = "Dual"'
          />
        );
      case "PH_PowerSupply_Single":
        return (
          <KpiCard
            label="Power Supply: Single"
            value={kpis.psSingle}
            accent={w.accent || "amber"}
            subtitle='powerSupply = "Single"'
          />
        );
      default:
        return null;
    }
  };

  const renderChartTop = (w: PhysicalWidgetInstance) => {
    switch (w.type) {
      case "PH_Cluster_Pie":
        return (
          <WidgetFrame
            title="Cluster"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "violet"}
          >
            <div className="h-[320px]">
              <PieChartComponent data={charts.clusterPie} />
            </div>
          </WidgetFrame>
        );
      case "PH_Brand_Donut":
        return (
          <WidgetFrame
            title="Brand"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "blue"}
          >
            <div className="h-[320px]">
              {/* If your donut supports center label, pass total via prop if available */}
              <DonutChartComponent data={charts.brandDonut} />
            </div>
          </WidgetFrame>
        );
      case "PH_StorageType_Pie":
        return (
          <WidgetFrame
            title="Storage Type"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "cyan"}
          >
            <div className="h-[320px]">
              <PieChartComponent data={charts.storageTypePie} />
            </div>
          </WidgetFrame>
        );
      case "PH_Status_Pie":
        return (
          <WidgetFrame
            title="Status"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "emerald"}
          >
            <div className="h-[320px]">
              <PieChartComponent data={charts.statusPie} />
            </div>
          </WidgetFrame>
        );
      default:
        return null;
    }
  };

  const renderChartBottom = (w: PhysicalWidgetInstance) => {
    switch (w.type) {
      case "PH_Location_Bar":
        return (
          <WidgetFrame
            title="Location"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "slate"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.locationBar} />
            </div>
          </WidgetFrame>
        );
      case "PH_OsVersion_Bar":
        return (
          <WidgetFrame
            title="OS Version"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as PhysicalAccent) || "violet"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.osVersionBar} />
            </div>
          </WidgetFrame>
        );
      default:
        return null;
    }
  };

  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* Toolbar */}
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

      {/* KPIs */}
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
            {renderKpi({
              ...w,
              accent: w.accent as PhysicalAccent | undefined,
            })}
          </div>
        )}
      />

      {/* Charts top (2-up) */}
      <ReorderableGrid
        items={layout.chartsTop}
        onReorder={(next) => reorder("chartsTop", next)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        renderItem={(w) => (
          <div className="w-full">
            {renderChartTop({
              ...w,
              accent: w.accent as PhysicalAccent | undefined,
            })}
          </div>
        )}
      />

      {/* Charts bottom (render as 2-up responsive; can host 2–4 items) */}
      <ReorderableGrid
        items={layout.chartsBottom}
        onReorder={(next) => reorder("chartsBottom", next)}
        className="grid grid-cols-1 gap-4"
        renderItem={(w) => (
          <div className="w-full">
            {renderChartBottom({
              ...w,
              accent: w.accent as PhysicalAccent | undefined,
            })}
          </div>
        )}
      />

      {/* Add dialog */}
      <AddWidgetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingTypes={[
          ...layout.kpis.map((x) => x.type),
          ...layout.chartsTop.map((x) => x.type),
          ...layout.chartsBottom.map((x) => x.type),
        ]}
        onAdd={addWidget}
        allWidgets={PHYSICAL_WIDGETS}
      />
    </div>
  );
}
