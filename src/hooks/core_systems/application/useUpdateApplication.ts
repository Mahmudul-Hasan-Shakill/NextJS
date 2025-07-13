"use client";
import { useState } from "react";
import { toast } from "sonner";
import { applicationService } from "@/services/core_systems/applicationServices";

export function useUpdateApplication() {
  const [loading, setLoading] = useState(false);

  const updateApplication = async (id: number, data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await applicationService.updateApplication(id, data);
      toast.success(res.message || "Application updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update application.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateApplication, loading };
}
