// src/components/dashboard/core/types.ts
export type Accent =
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "blue"
  | "slate"
  | "indigo";

export type WidgetSection = "kpis" | "chartsTop" | "chartsBottom";

export type BaseWidgetInstance<TType extends string = string> = {
  id: string;
  type: TType; // tab-specific string union
  title?: string;
  accent?: Accent;
};

export type BaseLayout<TType extends string = string> = {
  kpis: BaseWidgetInstance<TType>[];
  chartsTop: BaseWidgetInstance<TType>[];
  chartsBottom: BaseWidgetInstance<TType>[];
};

export type BaseWidgetMeta<TType extends string = string> = {
  type: TType;
  title: string;
  defaultAccent?: Accent;
  section: WidgetSection;
};
