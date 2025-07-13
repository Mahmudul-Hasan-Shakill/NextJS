import useSWR from "swr";
import { amcService } from "@/services/core_systems/amcServices";

const fetchAmcs = async () => {
  const response = await amcService.getAllAmcs();
  if (Array.isArray(response)) {
    return response;
  }
  throw new Error("Failed to fetch AMCs");
};

export function useAllAmcs() {
  const { data, error, mutate } = useSWR("amcs", fetchAmcs);

  return {
    amcs: data || [],
    error,
    mutate,
  };
}
