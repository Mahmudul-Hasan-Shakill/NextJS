// import { useEffect, useState } from "react";
// import { roleService } from "@/services/roleServices";

// export function useGuiByRoleName(roleName: string) {
//   const [guiData, setGuiData] = useState<any>(null);

//   useEffect(() => {
//     if (!roleName) return;

//     const fetchGui = async () => {
//       try {
//         const response = await roleService.getGuiByRoleName(roleName);
//         if (response?.isSuccessful) {
//           setGuiData(response.data);
//         }
//       } catch (err) {
//         console.error(`Error fetching GUI for role ${roleName}:`, err);
//       }
//     };

//     fetchGui();
//   }, [roleName]);

//   return guiData;
// }

"use client";

import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";
import { GuiByRoleNameResponse } from "@/types/role"; // Import the specific type

export function useGuiByRoleName(roleName: string) {
  const [guiData, setGuiData] = useState<GuiByRoleNameResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleName) {
      setGuiData(null);
      return;
    }

    const fetchGui = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await roleService.getGuiByRoleName(roleName);
        if (response?.isSuccessful) {
          setGuiData(response.data);
        } else {
          setError(response?.message || "Failed to load GUI data.");
          setGuiData([]); // Set to empty array on failure
        }
      } catch (err: any) {
        console.error(`Error fetching GUI for role ${roleName}:`, err);
        setError(err.message || "Error fetching GUI data.");
        setGuiData([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchGui();
  }, [roleName]);

  return { data: guiData, isLoading, error };
}
