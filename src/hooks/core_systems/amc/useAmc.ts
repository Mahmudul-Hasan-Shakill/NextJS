import useSWR from "swr";
import { amcService } from "@/services/core_systems/amcServices";
import {
  AmcCreatePayload,
  AmcData,
  AmcQueryParams,
  AmcUpdatePayload,
} from "@/types/amc";
import { useState } from "react";
import { toast } from "sonner";

export function useAllAmc(queryParams?: AmcQueryParams) {
  const fetcher = async () => {
    const response = await amcService.getAllAmc(queryParams);
    if (response?.isSuccessful && Array.isArray(response.data)) {
      return response.data;
    }
    console.error("Invalid AMC response:", response);
    throw new Error("Failed to fetch AMC records");
  };

  const { data, error, mutate } = useSWR(
    queryParams ? `amc-${JSON.stringify(queryParams)}` : "amc",
    fetcher
  );

  return {
    amcRecords: data ?? [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}

export function useGetAmc() {
  const [amc, setAmc] = useState<AmcData | null>(null);
  const [loading, setLoading] = useState(false);

  const getAmc = async (id: number): Promise<AmcData | null> => {
    setLoading(true);
    try {
      const res = await amcService.getAmc(id);
      if (res?.isSuccessful) {
        setAmc(res.data);
        return res.data;
      } else {
        toast.error(res.message || "Failed to fetch AMC record.");
        return null;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch AMC record.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { amc, getAmc, loading };
}

export function useCreateAmc() {
  const [loading, setLoading] = useState(false);

  const createAmc = async (data: AmcCreatePayload): Promise<AmcData | null> => {
    setLoading(true);
    try {
      const res = await amcService.createAmc(data);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return res.data; // Return the created AMC data
      } else {
        toast.error(res.message || "Failed to create AMC record.");
        return null; // Return null if creation fails
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create AMC record.");
      return null; // Return null on error
    } finally {
      setLoading(false);
    }
  };

  return { createAmc, loading };
}

export function useUpdateAmc() {
  const [loading, setLoading] = useState(false);

  const updateAmc = async (
    id: number,
    data: AmcUpdatePayload
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await amcService.updateAmc(id, data);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res.message || "Failed to update AMC record.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update AMC record.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateAmc, loading };
}

export function useDeleteAmc() {
  const [loading, setLoading] = useState(false);

  const deleteAmc = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await amcService.deleteAmc(id);
      if (res?.isSuccessful) {
        toast.success(res.message);
        return true;
      } else {
        toast.error(res.message || "Failed to delete AMC record.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete AMC record.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAmc, loading };
}
