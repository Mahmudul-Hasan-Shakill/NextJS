"use client";
import { useState } from "react";
import { toast } from "sonner";
import { databaseService } from "@/services/core_systems/databaseServices";

export function useCreateDatabase() {
  const [loading, setLoading] = useState(false);

  const createDatabase = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await databaseService.createDatabase(data);
      toast.success(res.message || "Database created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create database.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createDatabase, loading };
}
