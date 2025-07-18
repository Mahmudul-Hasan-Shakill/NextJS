"use client";
import { useState } from "react";
import { toast } from "sonner";
import { automationService } from "@/services/core_systems/automationService";

export function useUpdateAutomation() {
  const [loading, setLoading] = useState(false);

  const updateAutomation = async (id: number, automationData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await automationService.updateAutomation(id, automationData);
      toast.success(res.message || "Automation updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update automation.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateAutomation, loading };
}
