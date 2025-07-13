"use client";
import { useState } from "react";
import { toast } from "sonner";
import { vmService } from "@/services/core_systems/vmServices";

export function useGetVm() {
  const [vm, setVm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getVm = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await vmService.getVm(id);
      setVm(res.data || res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch VM.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { vm, getVm, loading };
}
