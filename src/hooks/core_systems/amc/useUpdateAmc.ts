"use client";
import { useState } from "react";
import { toast } from "sonner";
import { amcService } from "@/services/core_systems/amcServices";

export function useUpdateAmc() {
  const [loading, setLoading] = useState(false);

  const updateAmc = async (id: number, data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await amcService.updateAmc(id, data);
      toast.success(res.message || "AMC updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update AMC.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateAmc, loading };
}
