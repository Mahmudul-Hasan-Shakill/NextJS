"use client";

import { useState } from "react";
import { roleService } from "@/services/roleServices";

export function useCreateRoles() {
  const [loading, setLoading] = useState(false);

  const createRoles = async (roleDtos: any[]) => {
    setLoading(true);
    try {
      const res = await roleService.createRoles(roleDtos);
      return res;
    } catch (err: any) {
      return {
        isSuccessful: false,
        message: err.message || "Unexpected error occurred.",
        data: [],
      };
    } finally {
      setLoading(false);
    }
  };

  return { createRoles, loading };
}
