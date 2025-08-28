// hooks/core_systems/filesystem/useDeleteFilesystem.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { filesystemService } from "@/services/core_systems/filesystemService";

export function useDeleteFilesystem() {
  const [loading, setLoading] = useState(false);

  const deleteFilesystem = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await filesystemService.deleteFilesystem(id);
      toast.success(res.message || "Filesystem deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete filesystem.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteFilesystem, loading };
}
