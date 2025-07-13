"use client";
import { useState } from "react";
import { toast } from "sonner";
import { databaseService } from "@/services/core_systems/databaseServices";

export function useDeleteDatabase() {
  const [loading, setLoading] = useState(false);

  const deleteDatabase = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await databaseService.deleteDatabase(id);
      toast.success(res.message || "Database deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete database.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDatabase, loading };
}
