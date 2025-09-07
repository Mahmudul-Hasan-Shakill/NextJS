// src/components/dashboard/backup/backup.types.ts

// Widget types for Backup dashboard
export type BackupWidgetType =
  | "BK_TotalApplications" // KPI
  | "BK_TotalClients" // KPI
  | "BK_Env_Pie" // Pie  (backupEnvironment)
  | "BK_Type_Donut" // Donut (backupType)
  | "BK_Os_Bar" // Bar   (os)
  | "BK_ScheduleWeekly_Bar" // Bar   (Mon..Sun)
  | "BK_ScheduleMonthly_Bar"; // Bar   (1..31)

export type BackupAccent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate";

// One widget instance
export type BackupWidgetInstance = {
  id: string;
  type: BackupWidgetType;
  title?: string;
  accent?: BackupAccent;
};

export type BackupLayout = {
  kpis: BackupWidgetInstance[];
  chartsTop: BackupWidgetInstance[]; // pie/donut (2)
  chartsBottom: BackupWidgetInstance[]; // bars (full-width, 1 by default)
};

// Catalog used by AddWidgetDialog
export const BACKUP_WIDGETS: {
  type: BackupWidgetType;
  title: string;
  defaultAccent?: BackupAccent;
  section: "kpis" | "chartsTop" | "chartsBottom";
}[] = [
  // KPIs
  {
    type: "BK_TotalApplications",
    title: "Total Applications",
    defaultAccent: "violet",
    section: "kpis",
  },
  {
    type: "BK_TotalClients",
    title: "Total Clients",
    defaultAccent: "emerald",
    section: "kpis",
  },

  // Charts (defaults)
  {
    type: "BK_Env_Pie",
    title: "Backup Environment (Pie)",
    section: "chartsTop",
  },
  { type: "BK_Type_Donut", title: "Backup Type (Donut)", section: "chartsTop" },
  { type: "BK_Os_Bar", title: "Operating System", section: "chartsBottom" },

  // Optional user-addable bars
  {
    type: "BK_ScheduleWeekly_Bar",
    title: "Schedule (Weekly) Bar",
    section: "chartsBottom",
  },
  {
    type: "BK_ScheduleMonthly_Bar",
    title: "Schedule (Monthly) Bar",
    section: "chartsBottom",
  },
];

// Keep default to **5** widgets: 2 KPI + 2 chartsTop + 1 bar (full width)
export const BACKUP_DEFAULT_LAYOUT: BackupLayout = {
  kpis: [
    {
      id: "bk-k1",
      type: "BK_TotalApplications",
      title: "Total Applications",
      accent: "violet",
    },
    {
      id: "bk-k2",
      type: "BK_TotalClients",
      title: "Total Clients",
      accent: "emerald",
    },
  ],
  chartsTop: [
    { id: "bk-c1", type: "BK_Env_Pie", title: "Backup Environment (Pie)" },
    { id: "bk-c2", type: "BK_Type_Donut", title: "Backup Type (Donut)" },
  ],
  chartsBottom: [
    { id: "bk-c3", type: "BK_Os_Bar", title: "Operating System" }, // full width
  ],
};

// Allowed (for guard/sanitizer)
export const BACKUP_ALLOWED_TYPES = new Set<BackupWidgetType>([
  "BK_TotalApplications",
  "BK_TotalClients",
  "BK_Env_Pie",
  "BK_Type_Donut",
  "BK_Os_Bar",
  "BK_ScheduleWeekly_Bar",
  "BK_ScheduleMonthly_Bar",
]);
