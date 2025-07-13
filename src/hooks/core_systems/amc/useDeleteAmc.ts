"use client";
import { useState } from "react";
import { toast } from "sonner";
import { amcService } from "@/services/core_systems/amcServices";

export function useDeleteAmc() {
  const [loading, setLoading] = useState(false);

  const deleteAmc = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await amcService.deleteAmc(id);
      toast.success(res.message || "AMC deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete AMC.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAmc, loading };
}
