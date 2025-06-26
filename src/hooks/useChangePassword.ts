import { useState } from "react";
import { userService } from "@/services/userServices";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (pin: string, updateUserDto: any) => {
    setLoading(true);
    try {
      const response = await userService.changePassword(pin, updateUserDto);
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
}
