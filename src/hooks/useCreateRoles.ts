import { useState } from "react";
import { roleService } from "@/services/roleServices";

export function useCreateRoles() {
  const [loading, setLoading] = useState(false);

  const createRoles = async (roleDtos: any[]) => {
    setLoading(true);
    try {
      const response = await roleService.createRoles(roleDtos);
      return response;
    } catch (err) {
      console.error("Error creating roles:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createRoles, loading };
}
