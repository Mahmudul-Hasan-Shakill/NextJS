"use client";
import { useState } from "react";
import { toast } from "sonner";
import { vmService } from "@/services/vmServices";

export function useUpdateVm() {
  const [loading, setLoading] = useState(false);

  const updateVm = async (id: number, vmData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await vmService.updateVm(id, vmData);
      toast.success(res.message || "VM updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update VM.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateVm, loading };
}
