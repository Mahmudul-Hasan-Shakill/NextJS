// src/components/dashboard/vm/vm.types.ts
import type {
  BaseWidgetMeta,
  BaseLayout,
  BaseWidgetInstance,
  Accent,
} from "../core/types";

export type VmWidgetType =
  | "Total_servers"
  | "Falcon_Installed"
  | "Qualys_Installed"
  | "NTP_Active"
  | "Patched"
  | "Server_Environment"
  | "Server_Platform"
  | "OS_Versions";

export type VmWidgetInstance = BaseWidgetInstance<VmWidgetType>;
export type VmLayout = BaseLayout<VmWidgetType>;

export const VM_WIDGETS: BaseWidgetMeta<VmWidgetType>[] = [
  {
    type: "Total_servers",
    title: "Total Servers",
    defaultAccent: "violet",
    section: "kpis",
  },
  {
    type: "Falcon_Installed",
    title: "Falcon Installed",
    defaultAccent: "amber",
    section: "kpis",
  },
  {
    type: "Qualys_Installed",
    title: "Qualys Installed",
    defaultAccent: "slate",
    section: "kpis",
  },
  {
    type: "NTP_Active",
    title: "NTP Active",
    defaultAccent: "blue",
    section: "kpis",
  },
  {
    type: "Patched",
    title: "Patched (≤30d)",
    defaultAccent: "emerald",
    section: "kpis",
  },
  {
    type: "Server_Environment",
    title: "Environment (Pie)",
    section: "chartsTop",
  },
  { type: "Server_Platform", title: "Platform (Donut)", section: "chartsTop" },
  { type: "OS_Versions", title: "OS Versions (Bar)", section: "chartsBottom" },
];

export const VM_ALLOWED_KPIS = new Set<VmWidgetType>([
  "Total_servers",
  "Falcon_Installed",
  "Qualys_Installed",
  "NTP_Active",
  "Patched",
]);

export const VM_ALLOWED_CHARTS = new Set<VmWidgetType>([
  "Server_Environment",
  "Server_Platform",
  "OS_Versions",
]);

export const VM_DEFAULT_LAYOUT: VmLayout = {
  kpis: [
    {
      id: "k1",
      type: "Total_servers",
      title: "Total Servers",
      accent: "violet",
    },
    {
      id: "k2",
      type: "Falcon_Installed",
      title: "Falcon Installed",
      accent: "amber",
    },
    {
      id: "k3",
      type: "Qualys_Installed",
      title: "Qualys Installed",
      accent: "slate",
    },
    { id: "k4", type: "NTP_Active", title: "NTP Active", accent: "blue" },
  ],
  chartsTop: [
    { id: "c1", type: "Server_Environment", title: "Environment (Pie)" },
    { id: "c2", type: "Server_Platform", title: "Platform (Donut)" },
  ],
  chartsBottom: [{ id: "c3", type: "OS_Versions", title: "OS Versions (Bar)" }],
};

export const VM_ALLOWED_TYPES = new Set<VmWidgetType>([
  ...VM_ALLOWED_KPIS,
  ...VM_ALLOWED_CHARTS,
]);

export type VmAccent = Accent;
