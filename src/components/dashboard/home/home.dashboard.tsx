// src/components/dashboard/home/home.dashboard.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Sparkles, X } from "lucide-react";

import KpiCard from "@/components/dashboard/core/kpiCard";
import AddWidgetDialog from "@/components/dashboard/core/addWidgetDialog";
import ReorderableGrid from "@/components/dashboard/core/reorderableGrid";

import { useHomeData } from "./home.data";
import {
  HOME_WIDGETS,
  HOME_DEFAULT_LAYOUT,
  HOME_ALLOWED_TYPES,
  HomeWidgetType,
  HomeWidgetInstance,
  HomeLayout,
} from "./home.types";
import { useDashboardLayout } from "../core/useDashboardLayout";
import { Title } from "./title";
import { Tagline } from "./tagline";

export default function HomeDashboard() {
  const { kpis } = useHomeData();

  const { layout, setLayout, addWidget, removeWidget, reset } =
    useDashboardLayout<HomeWidgetType>({
      storageKey: "dash_home_v1",
      allWidgets: HOME_WIDGETS,
      allowedTypes: HOME_ALLOWED_TYPES,
      defaultLayout: HOME_DEFAULT_LAYOUT,
    });

  const reorder = (section: keyof HomeLayout, next: HomeWidgetInstance[]) =>
    setLayout((prev) => ({ ...prev, [section]: next }));

  const renderKpi = (w: HomeWidgetInstance) => {
    switch (w.type) {
      case "HOME_TotalUsers":
        return (
          <KpiCard
            label="Total Users"
            value={kpis.total}
            accent={w.accent || "violet"}
            subtitle="All registered users"
          />
        );
      case "HOME_InactiveUsers":
        return (
          <KpiCard
            label="Inactive Users"
            value={kpis.inactive}
            accent={w.accent || "rose"}
            subtitle="Currently deactivated"
          />
        );
      case "HOME_LoggedIn":
        return (
          <KpiCard
            label="Logged In Now"
            value={kpis.loggedIn}
            accent={w.accent || "emerald"}
            subtitle="Active sessions"
          />
        );
      case "HOME_Locked":
        return (
          <KpiCard
            label="Locked Accounts"
            value={kpis.locked}
            accent={w.accent || "slate"}
            subtitle="Require admin unlock"
          />
        );
      case "HOME_Reset":
        return (
          <KpiCard
            label="Password Reset Users"
            value={kpis.reset}
            accent={w.accent || "amber"}
            subtitle="Reset requested/enforced"
          />
        );
      default:
        return null;
    }
  };

  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="w-full space-y-4 p-3 sm:p-4 md:p-6">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border bg-white dark:bg-zinc-950 ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10" /> */}
        <div className="relative p-4 sm:p-6 md:p-8">
          {/* Centered header content */}
          <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
            {/* Centered Title */}
            <div className="w-full flex justify-center">
              <Title />
            </div>

            {/* Centered Tagline */}
            <div className="w-full flex justify-center">
              <Tagline />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons centered below */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
          Add Widget
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={reset}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
          Reset Layout
        </Button>
      </div>

      {/* KPI Grid (defaults to 4; user can add the 5th) */}
      <ReorderableGrid
        items={layout.kpis}
        onReorder={(next) => reorder("kpis", next as HomeWidgetInstance[])}
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        renderItem={(w) => (
          <div className="relative group">
            {/* remove pill appears on hover via your core pattern */}
            <button
              onClick={() => removeWidget(w.id)}
              className="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-background border shadow p-0.5 sm:p-1 hover:bg-muted opacity-0 group-hover:opacity-100 transition"
              title="Remove"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            {renderKpi(w as HomeWidgetInstance)}
          </div>
        )}
      />

      {/* No default charts on Home; still compatible with core layout shape */}
      {/* chartsTop / chartsBottom are empty by default */}

      <AddWidgetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingTypes={[
          ...layout.kpis.map((x) => x.type),
          ...layout.chartsTop.map((x) => x.type),
          ...layout.chartsBottom.map((x) => x.type),
        ]}
        onAdd={addWidget}
        allWidgets={HOME_WIDGETS}
      />
    </div>
  );
}
