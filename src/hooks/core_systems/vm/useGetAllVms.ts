// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { vmService } from "@/services/vmServices";

// export function useGetAllVms() {
//   const [vms, setVms] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVms = async () => {
//       setLoading(true);
//       try {
//         const res = await vmService.getAllVms();
//         setVms(res.data || []);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to fetch VMs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVms();
//   }, []);

//   return { vms, loading };
// }

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
