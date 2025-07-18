"use client";
import { useState } from "react";
import { automationService } from "@/services/core_systems/automationService";
import { toast } from "sonner";

export function useDeleteAutomation() {
  const [loading, setLoading] = useState(false);

  const deleteAutomation = async (id: number) => {
    setLoading(true);
    try {
      const res = await automationService.deleteAutomation(id);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res?.message);
        return false;
      }
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { deleteAutomation, loading };
}
