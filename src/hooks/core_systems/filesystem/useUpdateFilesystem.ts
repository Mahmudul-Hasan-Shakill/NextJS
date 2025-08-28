// hooks/core_systems/filesystem/useUpdateFilesystem.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { filesystemService } from "@/services/core_systems/filesystemService";

export function useUpdateFilesystem() {
  const [loading, setLoading] = useState(false);

  const updateFilesystem = async (
    id: number,
    payload: any
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await filesystemService.updateFilesystem(id, payload);
      toast.success(res.message || "Filesystem updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update filesystem.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateFilesystem, loading };
}
