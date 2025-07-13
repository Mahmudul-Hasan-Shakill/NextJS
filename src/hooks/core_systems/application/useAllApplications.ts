import useSWR from "swr";
import { applicationService } from "@/services/core_systems/applicationServices";

const fetchApplications = async () => {
  const response = await applicationService.getAllApplications();
  if (Array.isArray(response)) {
    return response;
  }
  throw new Error("Failed to fetch applications");
};

export function useAllApplications() {
  const { data, error, mutate } = useSWR("applications", fetchApplications);

  return {
    applications: data || [],
    error,
    mutate,
  };
}
