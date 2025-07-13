"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { vmService } from "@/services/core_systems/vmServices";

export function useGetVmIp() {
  const [vmIp, setVmIp] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVms = async () => {
      setLoading(true);
      try {
        const res = await vmService.getAllVms();
        const ipList = Array.isArray(res.data)
          ? res.data.map((vm: any) => vm.osIpAddress).filter(Boolean)
          : [];
        setVmIp(ipList);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch VMs.");
      } finally {
        setLoading(false);
      }
    };

    fetchVms();
  }, []);

  return { vmIp, loading };
}
