import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";

export function useGuiNames() {
  const [guiNames, setGuiNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchGuiNames = async () => {
      try {
        const response = await roleService.getGuiNames();
        if (response?.isSuccessful && Array.isArray(response.data)) {
          setGuiNames(response.data);
        }
      } catch (err) {
        console.error("Error fetching GUI names:", err);
      }
    };

    fetchGuiNames();
  }, []);

  return guiNames;
}
