import { useEffect, useState } from "react";
import { roleService } from "@/services/roleServices";

export function useRoleNames() {
  const [roleNames, setRoleNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleNames = async () => {
      try {
        const response = await roleService.getRoleNames();
        if (response?.isSuccessful && Array.isArray(response.data)) {
          setRoleNames(response.data);
        } else {
          setError("Failed to load roles");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleNames();
  }, []);

  return { roleNames, loading, error };
}
