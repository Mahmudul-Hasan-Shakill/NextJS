// hooks/device/useDevice.ts
"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { deviceService } from "@/services/deviceServices";
import type { DeviceEdit, DeviceReg } from "@/types/device";

const fetchDevices = async () => {
  const res = await deviceService.getAllDevices();
  // Expecting: { isSuccessful, data: DeviceEntity[] }
  const rows = Array.isArray(res?.data) ? res.data : [];
  // flatten extras for UI consumption
  return rows.map((r: any) => ({ ...r, ...(r.extras || {}) }));
};

export function useAllDevices() {
  const { data, error, mutate, isLoading } = useSWR("devices", fetchDevices);
  return {
    devices: data ?? [],
    error,
    isLoading: !!isLoading,
    mutate,
  };
}

export function useCreateDevice() {
  const [loading, setLoading] = useState(false);
  const createDevice = async (payload: DeviceReg): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await deviceService.createDevice(payload);
      toast.success(res.message || "Device created.");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to create device.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { loading, createDevice };
}

export function useUpdateDevice() {
  const [loading, setLoading] = useState(false);
  const updateDevice = async (
    id: number,
    payload: Partial<DeviceEdit>
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await deviceService.updateDevice(id, payload);
      toast.success(res.message || "Device updated.");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update device.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { loading, updateDevice };
}

export function useDeleteDevice() {
  const [loading, setLoading] = useState(false);
  const deleteDevice = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await deviceService.deleteDevice(id);
      toast.success(res.message || "Device deleted.");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete device.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { loading, deleteDevice };
}

// ✅ Bulk Delete (single toast, reuses single delete endpoint)
export function useBulkDeleteDevices() {
  const [loading, setLoading] = useState(false);

  const bulkDelete = async (ids: (number | string)[]) => {
    if (!ids?.length) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deviceService.deleteDevice(Number(id)))
      );

      const success = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - success;

      if (failed === 0) toast.success(`Deleted ${success} item(s).`);
      else if (success === 0)
        toast.error(`Failed to delete ${failed} item(s).`);
      else toast.warning(`Deleted ${success}, failed ${failed}.`);
      return { success, failed };
    } catch (err: any) {
      toast.error(err?.message || "Bulk delete failed.");
      return { success: 0, failed: ids.length };
    } finally {
      setLoading(false);
    }
  };

  return { loading, bulkDelete };
}

// ✅ Bulk Update (single toast, reuses single update endpoint)
export function useBulkUpdateDevices() {
  const [loading, setLoading] = useState(false);

  const bulkUpdate = async (
    ids: (number | string)[],
    patch: Partial<DeviceEdit>
  ) => {
    if (!ids?.length) return;
    if (!patch || Object.keys(patch).length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deviceService.updateDevice(Number(id), patch))
      );

      const success = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - success;

      if (failed === 0) toast.success(`Updated ${success} item(s).`);
      else if (success === 0)
        toast.error(`Failed to update ${failed} item(s).`);
      else toast.warning(`Updated ${success}, failed ${failed}.`);
      return { success, failed };
    } catch (err: any) {
      toast.error(err?.message || "Bulk update failed.");
      return { success: 0, failed: ids.length };
    } finally {
      setLoading(false);
    }
  };

  return { loading, bulkUpdate };
}
