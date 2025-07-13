import useSWR from "swr";
import { databaseService } from "@/services/core_systems/databaseServices";

const fetchDatabases = async () => {
  const response = await databaseService.getAllDatabases();
  if (Array.isArray(response)) {
    return response;
  }
  throw new Error("Failed to fetch databases");
};

export function useAllDatabases() {
  const { data, error, mutate } = useSWR("databases", fetchDatabases);

  return {
    databases: data || [],
    error,
    mutate,
  };
}
