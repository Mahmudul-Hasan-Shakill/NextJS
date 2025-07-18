"use client";
import { useState } from "react";
import { toast } from "sonner";
import { automationService } from "@/services/core_systems/automationService";

export function useGetAutomation() {
  const [automation, setAutomation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getAutomation = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await automationService.getAutomation(id);
      setAutomation(res.data || res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch automation.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { automation, getAutomation, loading };
}
