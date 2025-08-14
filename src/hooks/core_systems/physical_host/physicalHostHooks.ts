"use client";
import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { physicalHostService } from "@/services/core_systems/physicalHostService";
// SWR Fetcher Functions
const fetchPhysicalHosts = async () => {
  const response = await physicalHostService.getAllPhysicalHosts();
  if (response?.isSuccessful) return response.data;
  throw new Error("Failed to fetch physical hosts");
};

const fetchPhysicalHostsSummary = async () => {
  const response = await physicalHostService.getPhysicalHostsSummary();
  if (response?.isSuccessful) return response.data;
  throw new Error("Failed to fetch physical hosts summary");
};

// All hooks in one file
export function usePhysicalHost() {
  // SWR Hooks
  const {
    data: physicalHosts,
    error: hostsError,
    mutate: mutateHosts,
  } = useSWR("physicalHosts", fetchPhysicalHosts);

  const {
    data: hostsSummary,
    error: summaryError,
    mutate: mutateSummary,
  } = useSWR("physicalHostsSummary", fetchPhysicalHostsSummary);

  // Stateful Hooks
  const [loading, setLoading] = useState(false);
  const [currentHost, setCurrentHost] = useState<any>(null);

  // Action Functions
  const createPhysicalHost = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalHostService.createPhysicalHost(data);
      mutateHosts();
      mutateSummary();
      toast.success(res.message || "Physical host created successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to create physical host.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePhysicalHost = async (
    id: number,
    data: any
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalHostService.updatePhysicalHost(id, data);
      mutateHosts();
      mutateSummary();
      toast.success(res.message || "Physical host updated successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update physical host.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePhysicalHost = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await physicalHostService.deletePhysicalHost(id);
      mutateHosts();
      mutateSummary();
      toast.success(res.message || "Physical host deleted successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete physical host.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPhysicalHost = async (id: number): Promise<any> => {
    setLoading(true);
    try {
      const res = await physicalHostService.getPhysicalHost(id);
      setCurrentHost(res.data);
      return res.data;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch physical host.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Data
    physicalHosts: physicalHosts || [],
    hostsSummary: hostsSummary || [],
    currentHost,

    // Loading states
    loading,
    hostsLoading: !physicalHosts && !hostsError,
    summaryLoading: !hostsSummary && !summaryError,

    // Errors
    hostsError,
    summaryError,

    // Actions
    createPhysicalHost,
    updatePhysicalHost,
    deletePhysicalHost,
    getPhysicalHost,
    refreshHosts: mutateHosts,
    refreshSummary: mutateSummary,
  };
}
