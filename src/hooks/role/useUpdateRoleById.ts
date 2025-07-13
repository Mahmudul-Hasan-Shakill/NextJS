import { useState } from "react";
import { roleService } from "@/services/roleServices";

export function useUpdateRoleById() {
  const [loading, setLoading] = useState(false);

  const updateRoleById = async (id: number, roleDto: any) => {
    setLoading(true);
    try {
      const response = await roleService.updateRoleById(id, roleDto);
      return response;
    } catch (err) {
      console.error(`Error updating role with ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRoleById, loading };
}
