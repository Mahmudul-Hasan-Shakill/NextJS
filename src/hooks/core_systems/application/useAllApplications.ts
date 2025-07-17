import useSWR from "swr";
import { applicationService } from "@/services/core_systems/applicationServices";

const fetchApplications = async () => {
  const response = await applicationService.getAllApplications();

  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data.map((app: any) => ({
      ...app,
      vmIds: app.vms?.map((vm: any) => vm.id) ?? [],
      vmIpAddresses: app.vms?.map((vm: any) => vm.osIpAddress) ?? [],
    }));
  }

  throw new Error("Failed to fetch applications");
};

export function useAllApplications() {
  const { data, error, mutate } = useSWR("applications", fetchApplications);

  return {
    applications: data ?? [],
    error,
    mutate,
  };
}
