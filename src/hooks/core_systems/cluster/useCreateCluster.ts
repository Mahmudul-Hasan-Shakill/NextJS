"use client";
import { useState } from "react";
import { toast } from "sonner";
import { clusterService } from "@/services/core_systems/clusterService";

export function useCreateCluster() {
  const [loading, setLoading] = useState(false);

  const createCluster = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await clusterService.createCluster(data);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res.message || "Failed to create cluster.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create cluster.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createCluster, loading };
}
