import useSWR from "swr";
import { automationService } from "@/services/core_systems/automationService";
import { AutomationEdit } from "@/types/automation";

const fetchAutomations = async () => {
  const response = await automationService.getAllAutomations();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((automation: any) => ({
      ...automation,
      id: automation.id,
    }));
  }
  throw new Error("Failed to fetch automations");
};

export function useAllAutomations() {
  const { data, error, mutate } = useSWR<AutomationEdit[]>(
    "automations",
    fetchAutomations
  );

  return {
    automations: data || [],
    error,
    mutate,
  };
}
