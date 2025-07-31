"use client";
import { useState } from "react";
import { toast } from "sonner";
import { clusterService } from "@/services/core_systems/clusterService";

export function useDeleteCluster() {
  const [loading, setLoading] = useState(false);

  const deleteCluster = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await clusterService.deleteCluster(id);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res.message || "Failed to delete cluster.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete cluster.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCluster, loading };
}
