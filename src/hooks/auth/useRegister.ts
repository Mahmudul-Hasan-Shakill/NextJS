"use client";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authServices";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  const register = async (formData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authService.registerService(formData);
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

  return { register, loading };
}
