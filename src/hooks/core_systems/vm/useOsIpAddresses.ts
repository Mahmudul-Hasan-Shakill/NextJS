import useSWR from "swr";
import { vmService } from "@/services/core_systems/vmServices";

const fetchOsIpAddresses = async () => {
  const response = await vmService.getAllVms();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    // Extracting osIpAddress and id from each VM
    return response.data.map((vm: any) => ({
      id: vm.id,
      osIpAddress: vm.osIpAddress,
    }));
  }
  throw new Error("Failed to fetch OS IP addresses");
};

export function useOsIpAddresses() {
  const { data, error, mutate } = useSWR("osIpAddresses", fetchOsIpAddresses);

  return {
    osIpAddresses: data || [],
    error,
    mutate,
  };
}
