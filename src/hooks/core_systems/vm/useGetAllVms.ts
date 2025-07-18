

import useSWR from "swr";
import { vmService } from "@/services/core_systems/vmServices";
import { VmEdit } from "@/types/vm";

const fetchVms = async () => {
  const response = await vmService.getAllVms();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((vm: any) => ({
      ...vm,
      id: vm.id,
    }));
  }
  throw new Error("Failed to fetch users");
};

export function useAllVms() {
  const { data, error, mutate } = useSWR<VmEdit[]>("vms", fetchVms);

  return {
    vms: data || [],
    error,
    mutate,
  };
}
