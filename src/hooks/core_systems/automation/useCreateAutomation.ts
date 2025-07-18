"use client";
import { useState } from "react";
import { toast } from "sonner";
import { automationService } from "@/services/core_systems/automationService";

export function useCreateAutomation() {
  const [loading, setLoading] = useState(false);

  const createAutomation = async (automationData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await automationService.createAutomation(automationData);
      toast.success(res.message);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createAutomation, loading };
}
