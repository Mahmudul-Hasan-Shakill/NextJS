// hooks/core_systems/filesystem/useCreateFilesystem.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { filesystemService } from "@/services/core_systems/filesystemService";

export function useCreateFilesystem() {
  const [loading, setLoading] = useState(false);

  const createFilesystem = async (payload: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await filesystemService.createFilesystem(payload);
      toast.success(res.message || "Filesystem created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create filesystem.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createFilesystem, loading };
}
