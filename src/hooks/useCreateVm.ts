"use client";
import { useState } from "react";
import { toast } from "sonner";
import { vmService } from "@/services/vmServices";

export function useCreateVm() {
  const [loading, setLoading] = useState(false);

  const createVm = async (vmData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await vmService.createVm(vmData);
      toast.success(res.message);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createVm, loading };
}
