"use client";
import { useState } from "react";
import { toast } from "sonner";
import { physicalService } from "@/services/core_systems/physicalServices";

export function useUpdatePhysical() {
  const [loading, setLoading] = useState(false);

  const updatePhysical = async (id: number, data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalService.updatePhysical(id, data);
      toast.success(res.message || "Physical server updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update physical server.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePhysical, loading };
}
