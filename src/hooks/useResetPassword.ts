// hooks/useResetPassword.ts
import { useState } from "react";
import { userService } from "@/services/userServices";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (pin: string) => {
    setLoading(true);
    try {
      const response = await userService.resetPassword(pin);
      return response;
    } catch (err: any) {
      throw err?.message || "Unexpected error occurred.";
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
