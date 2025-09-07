// src/components/dashboard/core/useDashboardLayout.ts
"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import type { BaseLayout, BaseWidgetInstance, BaseWidgetMeta } from "./types";

type Stored<TType extends string> = {
  byRole: Record<string, BaseLayout<TType>>;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function getRoleKey() {
  return (Cookies.get("USRROLE") || "default").toLowerCase();
}

function loadLayout<TType extends string>(
  storageKey: string,
  roleKey: string,
  fallback: BaseLayout<TType>
): BaseLayout<TType> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed: Stored<TType> = JSON.parse(raw);
      const existing = parsed?.byRole?.[roleKey];
      if (existing) return existing;
      if (parsed?.byRole?.default) return parsed.byRole.default;
    }
  } catch {}
  return fallback;
}

function saveLayout<TType extends string>(
  storageKey: string,
  roleKey: string,
  layout: BaseLayout<TType>
) {
  let box: Stored<TType> = { byRole: {} };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) box = JSON.parse(raw);
  } catch {}
  box.byRole = box.byRole || {};
  box.byRole[roleKey] = layout;
  if (roleKey !== "default") box.byRole.default = layout;
  localStorage.setItem(storageKey, JSON.stringify(box));
}

function clearLayout<TType extends string>(
  storageKey: string,
  roleKey: string
) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const box: Stored<TType> = JSON.parse(raw);
    if (box?.byRole) {
      delete box.byRole[roleKey];
      if (roleKey !== "default") delete box.byRole.default;
      if (Object.keys(box.byRole).length === 0)
        localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, JSON.stringify(box));
    }
  } catch {}
}

export function useDashboardLayout<TType extends string>({
  storageKey,
  allWidgets,
  allowedTypes,
  defaultLayout,
}: {
  storageKey: string; // e.g. "dash_vm_v1"
  allWidgets: BaseWidgetMeta<TType>[];
  allowedTypes: Set<TType>;
  defaultLayout: BaseLayout<TType>; // 4 KPIs + charts
}) {
  const roleKey = getRoleKey();

  // sanitizer keeps only allowed widget types; if empty → use defaults
  const sanitize = (input: BaseLayout<TType>): BaseLayout<TType> => {
    const keep = (w: BaseWidgetInstance<TType>) => allowedTypes.has(w.type);
    const kpis = (input.kpis || []).filter(keep);
    const chartsTop = (input.chartsTop || []).filter(keep);
    const chartsBottom = (input.chartsBottom || []).filter(keep);
    if (!kpis.length && !chartsTop.length && !chartsBottom.length)
      return defaultLayout;
    return { kpis, chartsTop, chartsBottom };
  };

  const [_layout, _setLayout] = useState<BaseLayout<TType>>(
    sanitize(loadLayout<TType>(storageKey, roleKey, defaultLayout))
  );

  const setLayoutSafe = (
    next: BaseLayout<TType> | ((prev: BaseLayout<TType>) => BaseLayout<TType>)
  ) => {
    if (typeof next === "function")
      _setLayout((prev) => sanitize((next as any)(prev)));
    else _setLayout(sanitize(next));
  };

  useEffect(() => {
    saveLayout<TType>(storageKey, roleKey, _layout);
  }, [_layout, roleKey, storageKey]);

  const addWidget = (type: TType) => {
    if (!allowedTypes.has(type)) return;
    const meta = allWidgets.find((w) => w.type === type);
    if (!meta) return;
    const item: BaseWidgetInstance<TType> = {
      id: uid(),
      type,
      title: meta.title,
      accent: meta.defaultAccent,
    };
    setLayoutSafe((prev) => {
      if (meta.section === "kpis")
        return { ...prev, kpis: [...prev.kpis, item] };
      if (meta.section === "chartsTop")
        return { ...prev, chartsTop: [...prev.chartsTop, item] };
      return { ...prev, chartsBottom: [...prev.chartsBottom, item] };
    });
  };

  const removeWidget = (id: string) =>
    setLayoutSafe((prev) => ({
      kpis: prev.kpis.filter((w) => w.id !== id),
      chartsTop: prev.chartsTop.filter((w) => w.id !== id),
      chartsBottom: prev.chartsBottom.filter((w) => w.id !== id),
    }));

  const reset = () => {
    clearLayout<TType>(storageKey, roleKey);
    setLayoutSafe({ kpis: [], chartsTop: [], chartsBottom: [] }); // will sanitize to defaults
  };

  return {
    layout: _layout,
    setLayout: setLayoutSafe,
    addWidget,
    removeWidget,
    reset,
  };
}
