"use client";
import { useState } from "react";
import { toast } from "sonner";
import { applicationService } from "@/services/core_systems/applicationServices";

export function useCreateApplication() {
  const [loading, setLoading] = useState(false);

  const createApplication = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await applicationService.createApplication(data);
      toast.success(res.message || "Application created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create application.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createApplication, loading };
}
