"use client";
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

  // Get allowed roles for a specific href (used in sidebar and route protection)
  const getRolesForHref = (href: string): string[] => {
    return rolesData
      .filter((role) => role.hrefGui?.toLowerCase() === href.toLowerCase())
      .map((role) => role.roleName.toLowerCase());
  };

  return { rolesData, getRolesForHref };
}
