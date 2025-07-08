"use client";
import { useState } from "react";
import { vmService } from "@/services/vmServices";
import { toast } from "sonner";

export function useDeleteVm() {
  const [loading, setLoading] = useState(false);

  const deleteVm = async (id: number) => {
    setLoading(true);
    try {
      const res = await vmService.deleteVm(id);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res?.message);
        return false;
      }
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { deleteVm, loading };
}
