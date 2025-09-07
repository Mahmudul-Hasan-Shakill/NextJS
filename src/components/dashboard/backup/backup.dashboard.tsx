// src/components/dashboard/backup/backup.dashboard.tsx
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

import { useBackupData } from "./backup.data";
import {
  BACKUP_WIDGETS,
  BACKUP_DEFAULT_LAYOUT,
  BACKUP_ALLOWED_TYPES,
  BackupWidgetType,
  BackupWidgetInstance,
  BackupLayout,
  BackupAccent,
} from "./backup.types";
import { useDashboardLayout } from "../core/useDashboardLayout";

export default function BackupDashboard() {
  const { kpis, charts } = useBackupData();

  const { layout, setLayout, addWidget, removeWidget, reset } =
    useDashboardLayout<BackupWidgetType>({
      storageKey: "dash_backup_v1",
      allWidgets: BACKUP_WIDGETS,
      allowedTypes: BACKUP_ALLOWED_TYPES,
      defaultLayout: BACKUP_DEFAULT_LAYOUT,
    });

  const reorder = (section: keyof BackupLayout, next: BackupWidgetInstance[]) =>
    setLayout((prev) => ({ ...prev, [section]: next }));

  const renderKpi = (w: BackupWidgetInstance) => {
    switch (w.type) {
      case "BK_TotalApplications":
        return (
          <KpiCard
            label="Total Applications"
            value={kpis.totalApplications}
            accent={w.accent || "violet"}
            subtitle="Unique application count"
          />
        );
      case "BK_TotalClients":
        return (
          <KpiCard
            label="Total Clients"
            value={kpis.totalClients}
            accent={w.accent || "emerald"}
            subtitle="Unique client/node count"
          />
        );
      default:
        return null;
    }
  };

  const renderChartTop = (w: BackupWidgetInstance) => {
    switch (w.type) {
      case "BK_Env_Pie":
        return (
          <WidgetFrame
            title="Backup Environment (Pie)"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as BackupAccent) || "cyan"}
          >
            <div className="h-[320px]">
              <PieChartComponent data={charts.envPie} />
            </div>
          </WidgetFrame>
        );
      case "BK_Type_Donut":
        return (
          <WidgetFrame
            title="Backup Type (Donut)"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as BackupAccent) || "blue"}
          >
            <div className="h-[320px]">
              <DonutChartComponent data={charts.typeDonut} />
            </div>
          </WidgetFrame>
        );
      default:
        return null;
    }
  };

  const renderChartBottom = (w: BackupWidgetInstance) => {
    switch (w.type) {
      case "BK_Os_Bar":
        return (
          <WidgetFrame
            title="Operating System"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as BackupAccent) || "violet"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.osBar} />
            </div>
          </WidgetFrame>
        );
      case "BK_ScheduleWeekly_Bar":
        return (
          <WidgetFrame
            title="Schedule (Weekly)"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as BackupAccent) || "amber"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.scheduleWeeklyBar} />
            </div>
          </WidgetFrame>
        );
      case "BK_ScheduleMonthly_Bar":
        return (
          <WidgetFrame
            title="Schedule (Monthly)"
            onRemove={() => removeWidget(w.id)}
            accent={(w.accent as BackupAccent) || "slate"}
          >
            <div className="h-[360px]">
              <BarChartComponent data={charts.scheduleMonthlyBar} />
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

      {/* KPIs (4 max by default across dashboards; we have 2 defaults here) */}
      <ReorderableGrid
        items={layout.kpis}
        onReorder={(next) => reorder("kpis", next as BackupWidgetInstance[])}
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
            {renderKpi(w as BackupWidgetInstance)}
          </div>
        )}
      />

      {/* Top charts (2 by default) */}
      <ReorderableGrid
        items={layout.chartsTop}
        onReorder={(next) =>
          reorder("chartsTop", next as BackupWidgetInstance[])
        }
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        renderItem={(w) => (
          <div className="w-full">
            {renderChartTop(w as BackupWidgetInstance)}
          </div>
        )}
      />

      {/* Bottom charts (bars are full width; 1 by default) */}
      <ReorderableGrid
        items={layout.chartsBottom}
        onReorder={(next) =>
          reorder("chartsBottom", next as BackupWidgetInstance[])
        }
        className="grid grid-cols-1 gap-4"
        renderItem={(w) => (
          <div className="w-full">
            {renderChartBottom(w as BackupWidgetInstance)}
          </div>
        )}
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
        allWidgets={BACKUP_WIDGETS}
      />
    </div>
  );
}
