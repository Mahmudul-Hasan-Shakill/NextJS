"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userServices";

export function useSelfRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (formData: any) => {
    setLoading(true);
    try {
      const res = await userService.selfRegister(formData);
      if (res?.isSuccessful) {
        toast.success(res.message);
        router.push("/");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}
