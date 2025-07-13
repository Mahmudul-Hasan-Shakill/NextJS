"use client";
import { useState } from "react";
import { toast } from "sonner";
import { amcService } from "@/services/core_systems/amcServices";

export function useGetAmc() {
  const [amc, setAmc] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getAmc = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await amcService.getAmc(id);
      setAmc(res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch AMC.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { amc, getAmc, loading };
}
