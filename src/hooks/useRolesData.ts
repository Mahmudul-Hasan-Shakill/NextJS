// hooks/useRolesData.ts
import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";

export function useRolesData() {
  const [rolesData, setRolesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAllRoles();

        if (response?.isSuccessful && Array.isArray(response.data)) {
          const activeRoles = response.data.filter((r: any) => r.isActive);
          setRolesData(activeRoles);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  return rolesData;
}
