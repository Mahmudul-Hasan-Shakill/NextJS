"use client";
import { useState } from "react";
import { toast } from "sonner";
import { applicationService } from "@/services/core_systems/applicationServices";

export function useDeleteApplication() {
  const [loading, setLoading] = useState(false);

  const deleteApplication = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await applicationService.deleteApplication(id);
      toast.success(res.message || "Application deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete application.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteApplication, loading };
}
