"use client";

import { useState } from "react";
import { userService } from "@/services/userServices";
import { toast } from "sonner";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (pin: string) => {
    setLoading(true);
    try {
      const response = await userService.resetPassword(pin);

      toast.success(response.message, {
        duration: 4000,
      });

      return response;
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error occurred.", {
        duration: 4000,
        icon: "❌",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
