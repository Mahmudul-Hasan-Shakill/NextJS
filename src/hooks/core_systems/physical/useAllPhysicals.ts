"use client";
import useSWR from "swr";
import { physicalService } from "@/services/core_systems/physicalServices";

const fetchPhysicals = async () => {
  const response = await physicalService.getAllPhysicals();
  if (Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      ...item,
      id: item.id,
    }));
  }
  throw new Error("Failed to fetch physical servers");
};

export function useAllPhysicals() {
  const { data, error, mutate } = useSWR("physicals", fetchPhysicals);

  return {
    physicals: data || [],
    error,
    mutate,
  };
}
