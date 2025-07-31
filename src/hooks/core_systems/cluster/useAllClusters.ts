import useSWR from "swr";
import { clusterService } from "@/services/core_systems/clusterService";

const fetchClusters = async () => {
  const response = await clusterService.getAllClusters();

  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data;
  }

  console.error("Invalid Cluster response:", response);
  throw new Error("Failed to fetch clusters");
};

export function useAllClusters() {
  const { data, error, mutate } = useSWR("clusters", fetchClusters);

  return {
    clusters: data ?? [],
    error,
    mutate,
  };
}
