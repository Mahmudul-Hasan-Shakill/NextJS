// src/components/dashboard/home/home.types.ts

export type HomeWidgetType =
  | "HOME_TotalUsers"
  | "HOME_InactiveUsers"
  | "HOME_LoggedIn"
  | "HOME_Locked"
  | "HOME_Reset";

export type HomeAccent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate";

export type HomeWidgetInstance = {
  id: string;
  type: HomeWidgetType;
  title?: string;
  accent?: HomeAccent;
};

export type HomeLayout = {
  kpis: HomeWidgetInstance[];
  chartsTop: HomeWidgetInstance[]; // (kept for framework parity; unused by default)
  chartsBottom: HomeWidgetInstance[]; // (kept for framework parity; unused by default)
};

export const HOME_WIDGETS: {
  type: HomeWidgetType;
  title: string;
  defaultAccent?: HomeAccent;
  section: "kpis" | "chartsTop" | "chartsBottom";
}[] = [
  {
    type: "HOME_TotalUsers",
    title: "Total Users",
    defaultAccent: "violet",
    section: "kpis",
  },
  {
    type: "HOME_InactiveUsers",
    title: "Inactive Users",
    defaultAccent: "rose",
    section: "kpis",
  },
  {
    type: "HOME_LoggedIn",
    title: "Currently Logged In",
    defaultAccent: "emerald",
    section: "kpis",
  },
  {
    type: "HOME_Locked",
    title: "Currently Locked",
    defaultAccent: "slate",
    section: "kpis",
  },
  {
    type: "HOME_Reset",
    title: "Password Reset Users",
    defaultAccent: "amber",
    section: "kpis",
  },
];

// Default 4 KPI (you can add the 5th “Password Reset Users” via +Add Widget)
export const HOME_DEFAULT_LAYOUT: HomeLayout = {
  kpis: [
    {
      id: "h-k1",
      type: "HOME_TotalUsers",
      title: "Total Users",
      accent: "violet",
    },
    {
      id: "h-k2",
      type: "HOME_InactiveUsers",
      title: "Inactive Users",
      accent: "rose",
    },
    {
      id: "h-k3",
      type: "HOME_LoggedIn",
      title: "Logged In Now",
      accent: "emerald",
    },
    {
      id: "h-k4",
      type: "HOME_Locked",
      title: "Locked Accounts",
      accent: "slate",
    },
  ],
  chartsTop: [],
  chartsBottom: [],
};

export const HOME_ALLOWED_TYPES = new Set<HomeWidgetType>([
  "HOME_TotalUsers",
  "HOME_InactiveUsers",
  "HOME_LoggedIn",
  "HOME_Locked",
  "HOME_Reset",
]);
