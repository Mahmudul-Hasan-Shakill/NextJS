// src/hooks/useVisibleTabs.ts
"use client";

import useSWR from "swr";
import Cookies from "js-cookie";
import { fetchVisibleTabs, type VisibleTab } from "@/services/tabsService";

const swrKey = () => {
  // make the cache sensitive to role/unit cookie (if present)
  const role = (Cookies.get("USRROLE") || "default").toLowerCase();
  const unit = (Cookies.get("USRUNIT") || "nou").toLowerCase();
  return ["visible_tabs", role, unit];
};

export function useVisibleTabs() {
  const { data, error, mutate, isLoading } = useSWR<VisibleTab[]>(
    swrKey(),
    fetchVisibleTabs,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tabs: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}
