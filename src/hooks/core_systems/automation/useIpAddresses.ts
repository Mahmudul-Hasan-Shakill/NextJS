import useSWR from "swr";
import { automationService } from "@/services/core_systems/automationService";

const fetchIpAddresses = async () => {
  const response = await automationService.getAllAutomations();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((automation: any) => ({
      id: automation.id,
      ipAddress: automation.ipAddress,
    }));
  }
  throw new Error("Failed to fetch IP addresses");
};

export function useIpAddresses() {
  const { data, error, mutate } = useSWR("ipAddresses", fetchIpAddresses);

  return {
    ipAddresses: data || [],
    error,
    mutate,
  };
}
