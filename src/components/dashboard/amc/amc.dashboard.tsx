// src/components/dashboard/amc/amc.dashboard.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, X } from "lucide-react";

import WidgetFrame from "@/components/dashboard/core/widgetFrame";
import KpiCard from "@/components/dashboard/core/kpiCard";
import AddWidgetDialog from "@/components/dashboard/core/addWidgetDialog";
import ReorderableGrid from "@/components/dashboard/core/reorderableGrid";

import { PieChartComponent } from "@/components/dashboard/charts/pieChartComponent";
import { DonutChartComponent } from "@/components/dashboard/charts/donutChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/barChartComponent";

import { useAmcData } from "./amc.data";
import {
  AMC_WIDGETS,
  AMC_DEFAULT_LAYOUT,
  AMC_ALLOWED_TYPES,
  AmcWidgetType,
  AmcWidgetInstance,
  AmcLayout,
  AmcAccent,
} from "./amc.types";
import { useDashboardLayout } from "../core/useDashboardLayout";

export default function AmcDashboard() {
  const { kpis, charts } = useAmcData();

  const { layout, setLayout, addWidget, removeWidget, reset } =
    useDashboardLayout<AmcWidgetType>({
      storageKey: "dash_amc_v1",
      allWidgets: AMC_WIDGETS,
      allowedTypes: AMC_ALLOWED_TYPES,
      defaultLayout: AMC_DEFAULT_LAYOUT,
    });

  const reorder = (section: keyof AmcLayout, next: AmcWidgetInstance[]) =>
    setLayout((prev) => ({ ...prev, [section]: next }));

  const renderKpi = (w: AmcWidgetInstance) => {
    switch (w.type) {
      case "AMC_Total":
        return (
          <KpiCard
            label="Total AMC Contracts"
            value={kpis.total}
            accent={w.accent || "violet"}
            subtitle="All AMC records"
          />
        );
      case "AMC_Active":
        return (
          <KpiCard
            label="Active AMCs"
            value={kpis.active}
            accent={w.accent || "emerald"}
            subtitle="isActive = true"
          />
        );
      case "AMC_ExpiringSoon":
        return (
          <KpiCard
            label="Expiring Soon (≤ 30 days)"
            value={kpis.expiringSoon}
            accent={w.accent || "amber"}
            subtitle="Based on AMC end date"
          />
        );
      case "AMC_EolEosl":
        return (
          <KpiCard
            label="EOL / EOSL Items"
            value={kpis.eolEosl}
            accent={w.accent || "rose"}
            subtitle="isEolOrEosl = true"
          />
        );
      default:
        return null;
    }
  };

  const renderChartTop = (w: AmcWidgetInstance) => {
    switch (w.type) {
      case "AMC_StatusDonut":
        return (
          <WidgetFrame
            title="AMC Status Breakdown"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "indigo"}
          >
            <div className="h-[320px]">
              <DonutChartComponent data={charts.statusDonut} />
            </div>
          </WidgetFrame>
        );
      case "AMC_VendorPie":
        return (
          <WidgetFrame
            title="Vendor Distribution"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "blue"}
          >
            <div className="h-[320px]">
              <PieChartComponent data={charts.vendorPie} />
            </div>
          </WidgetFrame>
        );
      case "AMC_EolEoslDonut":
        return (
          <WidgetFrame
            title="EOL/EOSL Status"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "amber"}
          >
            <div className="h-[320px]">
              <DonutChartComponent data={charts.eolDonut} />
            </div>
          </WidgetFrame>
        );
      default:
        return null;
    }
  };

  const renderChartBottom = (w: AmcWidgetInstance) => {
    switch (w.type) {
      case "AMC_VendorBar":
        return (
          <WidgetFrame
            title="AMC Contracts by Vendor"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "violet"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.vendorBar} />
            </div>
          </WidgetFrame>
        );
      case "AMC_StatusBar":
        return (
          <WidgetFrame
            title="Contracts by Status"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "slate"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.statusBar} />
            </div>
          </WidgetFrame>
        );
      case "AMC_SupportTypeBar":
        return (
          <WidgetFrame
            title="Support Type Distribution"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as AmcAccent) || "cyan"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.supportTypeBar} />
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

      {/* KPIs (default 4) */}
      <ReorderableGrid
        items={layout.kpis}
        onReorder={(next) => reorder("kpis", next as AmcWidgetInstance[])}
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
            {renderKpi(w as AmcWidgetInstance)}
          </div>
        )}
      />

      {/* Charts top (2-up: donut + pie by default) */}
      <ReorderableGrid
        items={layout.chartsTop}
        onReorder={(next) => reorder("chartsTop", next as AmcWidgetInstance[])}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        renderItem={(w) => (
          <div className="w-full">{renderChartTop(w as AmcWidgetInstance)}</div>
        )}
      />

      {/* Charts bottom (1 full-width bar by default) */}
      <ReorderableGrid
        items={layout.chartsBottom}
        onReorder={(next) =>
          reorder("chartsBottom", next as AmcWidgetInstance[])
        }
        className="grid grid-cols-1 gap-4"
        renderItem={(w) => (
          <div className="w-full">
            {renderChartBottom(w as AmcWidgetInstance)}
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
        allWidgets={AMC_WIDGETS}
      />
    </div>
  );
}
