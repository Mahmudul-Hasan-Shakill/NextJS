"use client";
import { useState } from "react";
import { toast } from "sonner";
import { databaseService } from "@/services/core_systems/databaseServices";

export function useGetDatabase() {
  const [database, setDatabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getDatabase = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await databaseService.getDatabase(id);
      setDatabase(res);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch database.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { database, getDatabase, loading };
}
