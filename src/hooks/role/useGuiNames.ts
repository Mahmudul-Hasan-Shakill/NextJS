// "use client";

// import { useEffect, useState } from "react";
// import { roleService } from "@/services/roleServices";

// export function useGuiNames() {
//   const [guiNames, setGuiNames] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchGuiNames = async () => {
//       try {
//         const response = await roleService.getGuiNames();
//         if (response?.isSuccessful && Array.isArray(response.data)) {
//           setGuiNames(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching GUI names:", err);
//       }
//     };

//     fetchGuiNames();
//   }, []);

//   return guiNames;
// }

"use client";

import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";

export function useGuiNames() {
  const [guiNames, setGuiNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuiNames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await roleService.getGuiNames();
        if (response?.isSuccessful && Array.isArray(response.data)) {
          setGuiNames(response.data);
        } else {
          setError(response?.message || "Failed to load GUI names.");
          setGuiNames([]);
        }
      } catch (err: any) {
        console.error("Error fetching GUI names:", err);
        setError(err.message || "Error fetching GUI names.");
        setGuiNames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuiNames();
  }, []);

  return { data: guiNames, isLoading, error };
}
