// hooks/core_systems/filesystem/useAllFilesystems.ts
"use client";

import useSWR from "swr";
import { filesystemService } from "@/services/core_systems/filesystemService";

const fetchFilesystems = async () => {
  const response = await filesystemService.getAllFilesystems();
  if (response?.isSuccessful && Array.isArray(response.data)) {
    return response.data;
  }
  throw new Error("Failed to fetch filesystems");
};

export function useAllFilesystems() {
  const { data, error, mutate } = useSWR("filesystems", fetchFilesystems);
  return {
    filesystems: data ?? [],
    error,
    mutate,
  };
}
