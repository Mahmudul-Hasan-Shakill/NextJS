// Allowed widget types for the Physical Host dashboard
export type PhysicalWidgetType =
  // KPIs
  | "PH_TotalServers"
  | "PH_WarrantyExpiring"
  | "PH_PowerSupply_Dual"
  | "PH_PowerSupply_Single"
  // Charts
  | "PH_Cluster_Pie"
  | "PH_Brand_Donut"
  | "PH_StorageType_Pie"
  | "PH_Status_Pie"
  | "PH_Location_Bar"
  | "PH_OsVersion_Bar";

export type PhysicalAccent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate";

export type PhysicalWidgetInstance = {
  id: string;
  type: PhysicalWidgetType;
  title?: string;
  accent?: PhysicalAccent;
};

export type PhysicalLayout = {
  kpis: PhysicalWidgetInstance[];
  chartsTop: PhysicalWidgetInstance[]; // 2-up
  chartsBottom: PhysicalWidgetInstance[]; // 2-up (we’ll render flexible grid)
};

// Catalog for AddWidget dialog + add/remove helpers
export const PHYSICAL_WIDGETS: {
  type: PhysicalWidgetType;
  title: string;
  defaultAccent?: PhysicalAccent;
  section: "kpis" | "chartsTop" | "chartsBottom";
}[] = [
  // KPIs
  {
    type: "PH_TotalServers",
    title: "Total Servers",
    defaultAccent: "violet",
    section: "kpis",
  },
  {
    type: "PH_WarrantyExpiring",
    title: "Warranty Expiring (≤30d)",
    defaultAccent: "rose",
    section: "kpis",
  },
  {
    type: "PH_PowerSupply_Dual",
    title: "Power Supply: Dual",
    defaultAccent: "emerald",
    section: "kpis",
  },
  {
    type: "PH_PowerSupply_Single",
    title: "Power Supply: Single",
    defaultAccent: "amber",
    section: "kpis",
  },

  // Charts (top 2)
  {
    type: "PH_Cluster_Pie",
    title: "Cluster (Pie)",
    section: "chartsTop",
  },
  {
    type: "PH_Brand_Donut",
    title: "Brand (Donut)",
    section: "chartsTop",
  },

  // Charts (bottom 4)
  {
    type: "PH_StorageType_Pie",
    title: "Storage Type (Pie)",
    section: "chartsBottom",
  },
  {
    type: "PH_Status_Pie",
    title: "Status (Pie)",
    section: "chartsBottom",
  },
  {
    type: "PH_Location_Bar",
    title: "Location (Bar)",
    section: "chartsBottom",
  },
  {
    type: "PH_OsVersion_Bar",
    title: "OS Version (Bar)",
    section: "chartsBottom",
  },
];

// Allowed for this dashboard
export const PHYSICAL_ALLOWED_TYPES = new Set<PhysicalWidgetType>([
  "PH_TotalServers",
  "PH_WarrantyExpiring",
  "PH_PowerSupply_Dual",
  "PH_PowerSupply_Single",
  "PH_Cluster_Pie",
  "PH_Brand_Donut",
  "PH_StorageType_Pie",
  "PH_Status_Pie",
  "PH_Location_Bar",
  "PH_OsVersion_Bar",
]);

export const PHYSICAL_DEFAULT_LAYOUT: PhysicalLayout = {
  kpis: [
    {
      id: "ph-k1",
      type: "PH_TotalServers",
      title: "Total Servers",
      accent: "violet",
    },
    {
      id: "ph-k2",
      type: "PH_WarrantyExpiring",
      title: "Warranty Expiring (≤30d)",
      accent: "rose",
    },
    {
      id: "ph-k3",
      type: "PH_PowerSupply_Dual",
      title: "Power Supply: Dual",
      accent: "emerald",
    },
    {
      id: "ph-k4",
      type: "PH_PowerSupply_Single",
      title: "Power Supply: Single",
      accent: "amber",
    },
  ],
  chartsTop: [
    { id: "ph-c1", type: "PH_Cluster_Pie", title: "Cluster (Pie)" },
    { id: "ph-c2", type: "PH_Brand_Donut", title: "Brand (Donut)" },
  ],
  chartsBottom: [
    { id: "ph-c6", type: "PH_OsVersion_Bar", title: "OS Version (Bar)" },
  ],
};
