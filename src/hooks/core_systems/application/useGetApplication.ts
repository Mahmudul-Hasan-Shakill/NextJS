"use client";
import { useState } from "react";
import { toast } from "sonner";
import { applicationService } from "@/services/core_systems/applicationServices";

export function useGetApplication() {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getApplication = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await applicationService.getApplication(id);
      setApplication(res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch application.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { application, getApplication, loading };
}
