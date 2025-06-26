import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";

export function useGuiByRoleName(roleName: string) {
  const [guiData, setGuiData] = useState<any>(null);

  useEffect(() => {
    if (!roleName) return;

    const fetchGui = async () => {
      try {
        const response = await roleService.getGuiByRoleName(roleName);
        if (response?.isSuccessful) {
          setGuiData(response.data);
        }
      } catch (err) {
        console.error(`Error fetching GUI for role ${roleName}:`, err);
      }
    };

    fetchGui();
  }, [roleName]);

  return guiData;
}
