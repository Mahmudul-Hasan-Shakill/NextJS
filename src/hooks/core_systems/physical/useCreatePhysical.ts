"use client";
import { useState } from "react";
import { toast } from "sonner";
import { physicalService } from "@/services/core_systems/physicalServices";

export function useCreatePhysical() {
  const [loading, setLoading] = useState(false);

  const createPhysical = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalService.createPhysical(data);
      toast.success(res.message || "Physical server created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create physical server.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createPhysical, loading };
}
