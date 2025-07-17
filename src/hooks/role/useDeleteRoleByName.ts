import { useState } from "react";
import { roleService } from "@/services/roleServices";

export function useDeleteRoleByName() {
  const [loading, setLoading] = useState(false);

  const deleteRoleByName = async (roleName: string) => {
    setLoading(true);
    try {
      const response = await roleService.deleteRoleByName(roleName);
      return response;
    } catch (err) {
      console.error(`Error deleting roles with roleName "${roleName}":`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRoleByName, loading };
}
