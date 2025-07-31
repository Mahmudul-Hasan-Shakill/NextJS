"use client";
import { useState } from "react";
import { toast } from "sonner";
import { clusterService } from "@/services/core_systems/clusterService";

export function useUpdateCluster() {
  const [loading, setLoading] = useState(false);

  const updateCluster = async (id: number, data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await clusterService.updateCluster(id, data);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res.message || "Failed to update cluster.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update cluster.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateCluster, loading };
}
