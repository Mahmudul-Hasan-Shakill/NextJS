import { useState } from "react";
import { userService } from "@/services/userServices";
import { toast } from "sonner";

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);

  const updateUser = async (id: number, updateUserDto: any) => {
    setLoading(true);
    try {
      const res = await userService.updateUser(id, updateUserDto);
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

  return { updateUser, loading };
}
