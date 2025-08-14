import { useEffect, useState } from "react";
import { clusterService } from "@/services/core_systems/clusterService";

export function useClusterNames() {
  const [clusterNames, setClusterNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusterNames = async () => {
      try {
        const response = await clusterService.getClusterNames();
        if (response?.isSuccessful && Array.isArray(response.data)) {
          setClusterNames(response.data);
        } else {
          setError("Failed to load clusters");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching clusters");
      } finally {
        setLoading(false);
      }
    };

    fetchClusterNames();
  }, []);

  return { clusterNames, loading, error };
}
