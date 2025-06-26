import { useState } from "react";
import { userService } from "@/services/userServices";
import { toast } from "sonner";

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      const res = await userService.deleteUser(id);
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
  return { deleteUser, loading };
}
