// src/components/dashboard/amc/amc.types.ts

export type AmcWidgetType =
  // KPIs
  | "AMC_Total"
  | "AMC_Active"
  | "AMC_ExpiringSoon"
  | "AMC_EolEosl"
  // Charts (top)
  | "AMC_StatusDonut" // Active vs Inactive/Retired (default)
  | "AMC_VendorPie" // Vendor distribution (default)
  // Charts (bottom full-width)
  | "AMC_VendorBar" // AMC contracts by vendor (default)
  // Addable extras
  | "AMC_StatusBar" // Contracts by Status
  | "AMC_SupportTypeBar" // Support type distribution
  | "AMC_EolEoslDonut"; // EOL/EOSL vs Supported

export type AmcAccent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate";

export type AmcWidgetInstance = {
  id: string;
  type: AmcWidgetType;
  title?: string;
  accent?: AmcAccent;
};

export type AmcLayout = {
  kpis: AmcWidgetInstance[];
  chartsTop: AmcWidgetInstance[]; // 2-up (pie/donut)
  chartsBottom: AmcWidgetInstance[]; // 1 full-width bar
};

export const AMC_WIDGETS: {
  type: AmcWidgetType;
  title: string;
  defaultAccent?: AmcAccent;
  section: "kpis" | "chartsTop" | "chartsBottom";
}[] = [
  // KPIs
  {
    type: "AMC_Total",
    title: "Total AMC Contracts",
    defaultAccent: "violet",
    section: "kpis",
  },
  {
    type: "AMC_Active",
    title: "Active AMCs",
    defaultAccent: "emerald",
    section: "kpis",
  },
  {
    type: "AMC_ExpiringSoon",
    title: "Expiring Soon (30d)",
    defaultAccent: "amber",
    section: "kpis",
  },
  {
    type: "AMC_EolEosl",
    title: "EOL/EOSL Items",
    defaultAccent: "rose",
    section: "kpis",
  },

  // Charts (top defaults)
  {
    type: "AMC_StatusDonut",
    title: "AMC Status Breakdown",
    section: "chartsTop",
  },
  { type: "AMC_VendorPie", title: "Vendor Distribution", section: "chartsTop" },

  // Charts (bottom default)
  {
    type: "AMC_VendorBar",
    title: "AMC Contracts by Vendor",
    section: "chartsBottom",
  },

  // Addable extras
  {
    type: "AMC_StatusBar",
    title: "Contracts by Status",
    section: "chartsBottom",
  },
  {
    type: "AMC_SupportTypeBar",
    title: "Support Type Distribution",
    section: "chartsBottom",
  },
  { type: "AMC_EolEoslDonut", title: "EOL/EOSL Status", section: "chartsTop" },
];

// ✅ Default = 4 KPIs + 2 pies/donuts (top) + 1 bar (bottom)
export const AMC_DEFAULT_LAYOUT: AmcLayout = {
  kpis: [
    {
      id: "a-k1",
      type: "AMC_Total",
      title: "Total AMC Contracts",
      accent: "violet",
    },
    { id: "a-k2", type: "AMC_Active", title: "Active AMCs", accent: "emerald" },
    {
      id: "a-k3",
      type: "AMC_ExpiringSoon",
      title: "Expiring Soon (30d)",
      accent: "amber",
    },
    {
      id: "a-k4",
      type: "AMC_EolEosl",
      title: "EOL/EOSL Items",
      accent: "rose",
    },
  ],
  chartsTop: [
    { id: "a-c1", type: "AMC_StatusDonut", title: "AMC Status Breakdown" },
    { id: "a-c2", type: "AMC_VendorPie", title: "Vendor Distribution" },
  ],
  chartsBottom: [
    { id: "a-b1", type: "AMC_VendorBar", title: "AMC Contracts by Vendor" },
  ],
};

export const AMC_ALLOWED_TYPES = new Set<AmcWidgetType>([
  "AMC_Total",
  "AMC_Active",
  "AMC_ExpiringSoon",
  "AMC_EolEosl",
  "AMC_StatusDonut",
  "AMC_VendorPie",
  "AMC_VendorBar",
  "AMC_StatusBar",
  "AMC_SupportTypeBar",
  "AMC_EolEoslDonut",
]);
