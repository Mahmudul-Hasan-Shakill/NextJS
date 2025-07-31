"use client";
import { useState } from "react";
import { toast } from "sonner";
import { clusterService } from "@/services/core_systems/clusterService";

export function useGetCluster() {
  const [cluster, setCluster] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getCluster = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await clusterService.getCluster(id);
      if (res?.isSuccessful) {
        setCluster(res.data);
        return res.data;
      } else {
        toast.error(res.message || "Failed to fetch cluster.");
        return null;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch cluster.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cluster, getCluster, loading };
}
