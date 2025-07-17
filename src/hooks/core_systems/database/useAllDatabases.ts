import useSWR from "swr";
import { databaseService } from "@/services/core_systems/databaseServices";

const fetchDatabases = async () => {
  const response = await databaseService.getAllDatabases();

  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((db: any) => ({
      ...db,
      vmIds: db.vms?.map((vm: any) => vm.id) ?? [],
      vmIpAddresses: db.vms?.map((vm: any) => vm.osIpAddress) ?? [],
    }));
  }

  throw new Error("Failed to fetch databases");
};

export function useAllDatabases() {
  const { data, error, mutate } = useSWR("databases", fetchDatabases);

  return {
    databases: data ?? [],
    error,
    mutate,
  };
}
