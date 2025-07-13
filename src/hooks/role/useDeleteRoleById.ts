import { useState } from "react";
import { roleService } from "@/services/roleServices";

export function useDeleteRoleById() {
  const [loading, setLoading] = useState(false);

  const deleteRoleById = async (id: number) => {
    setLoading(true);
    try {
      const response = await roleService.deleteRoleById(id);
      return response;
    } catch (err) {
      console.error(`Error deleting role with ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRoleById, loading };
}
