"use client";
import { useState } from "react";
import { toast } from "sonner";
import { physicalService } from "@/services/physicalServices";

export function useGetPhysical() {
  const [physical, setPhysical] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getPhysical = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await physicalService.getPhysical(id);
      setPhysical(res.data || res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch physical server.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { physical, getPhysical, loading };
}
