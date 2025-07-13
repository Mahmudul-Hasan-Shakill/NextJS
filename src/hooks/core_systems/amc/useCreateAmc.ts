"use client";
import { useState } from "react";
import { toast } from "sonner";
import { amcService } from "@/services/core_systems/amcServices";

export function useCreateAmc() {
  const [loading, setLoading] = useState(false);

  const createAmc = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await amcService.createAmc(data);
      toast.success(res.message || "AMC created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create AMC.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createAmc, loading };
}
