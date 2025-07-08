"use client";
import { useState } from "react";
import { toast } from "sonner";
import { physicalService } from "@/services/physicalServices";

export function useDeletePhysical() {
  const [loading, setLoading] = useState(false);

  const deletePhysical = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalService.deletePhysical(id);
      toast.success(res.message || "Physical server deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete physical server.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePhysical, loading };
}
