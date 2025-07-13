"use client";
import { useState } from "react";
import { toast } from "sonner";
import { databaseService } from "@/services/core_systems/databaseServices";

export function useUpdateDatabase() {
  const [loading, setLoading] = useState(false);

  const updateDatabase = async (id: number, data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await databaseService.updateDatabase(id, data);
      toast.success(res.message || "Database updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update database.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateDatabase, loading };
}
