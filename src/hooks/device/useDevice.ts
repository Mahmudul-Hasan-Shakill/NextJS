// // /hooks/device/useDevice.ts
// "use client";

// import useSWR from "swr";
// import { useState } from "react";
// import { toast } from "sonner";
// import { deviceService } from "@/services/deviceServices";
// import type { DeviceEdit } from "@/types/device";

// /** GET all devices (flatten extras for UI tables) */
// const fetchDevices = async () => {
//   const res = await deviceService.getAllDevices();
//   if (!res?.isSuccessful || !Array.isArray(res.data)) {
//     throw new Error(res?.message || "Failed to fetch devices");
//   }
//   // flatten extras -> top-level
//   return res.data.map((d: any) => ({ ...d, ...(d.extras || {}) }));
// };

// export function useAllDevices() {
//   const { data, error, mutate } = useSWR("devices", fetchDevices);
//   return {
//     devices: data ?? [],
//     loading: !data && !error,
//     error,
//     mutate,
//   };
// }

// export function useCreateDevice() {
//   const [loading, setLoading] = useState(false);
//   const createDevice = async (payload: any) => {
//     setLoading(true);
//     try {
//       const res = await deviceService.createDevice(payload);
//       toast.success(res?.message || "Device created");
//       return true;
//     } catch (err: any) {
//       toast.error(err.message || "Create failed");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };
//   return { createDevice, loading };
// }

// export function useUpdateDevice() {
//   const [loading, setLoading] = useState(false);
//   const updateDevice = async (id: number, payload: any) => {
//     setLoading(true);
//     try {
//       const res = await deviceService.updateDevice(id, payload);
//       toast.success(res?.message || "Device updated");
//       return true;
//     } catch (err: any) {
//       toast.error(err.message || "Update failed");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };
//   return { updateDevice, loading };
// }

// export function useDeleteDevice() {
//   const [loading, setLoading] = useState(false);
//   const deleteDevice = async (id: number) => {
//     setLoading(true);
//     try {
//       const res = await deviceService.deleteDevice(id);
//       toast.success(res?.message || "Device deleted");
//       return true;
//     } catch (err: any) {
//       toast.error(err.message || "Delete failed");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };
//   return { deleteDevice, loading };
// }

// export function useGetDevice() {
//   const [device, setDevice] = useState<DeviceEdit | null>(null);
//   const [loading, setLoading] = useState(false);

//   const getDevice = async (id: number) => {
//     setLoading(true);
//     try {
//       const res = await deviceService.getDevice(id);
//       if (res?.isSuccessful) setDevice(res.data);
//       return res?.data;
//     } catch (err: any) {
//       toast.error(err.message || "Fetch failed");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { device, getDevice, loading };
// }

// export default {
//   useAllDevices,
//   useCreateDevice,
//   useUpdateDevice,
//   useDeleteDevice,
//   useGetDevice,
// };

// hooks/device/useDevice.ts
"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { deviceService } from "@/services/deviceServices";
import type { DeviceEdit, DeviceReg } from "@/types/device";

/**
 * NOTE:
 *  - No client-side filtering by unit/role.
 *  - We trust the backend to scope results based on the authenticated user.
 *  - We only flatten extras for the table/UI.
 */

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
