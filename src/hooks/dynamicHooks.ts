// hooks/dynamicHooks.ts
"use client";

import { useCallback, useState } from "react";
import { dynamicService } from "@/services/dynamicServices";
import {
  UiSchemaResponse,
  UpsertFieldPayload,
  RemoveFieldPayload,
  ReorderFieldsPayload,
  ApiSuccess,
} from "@/types/dynamic";

export function useDynamicSchema() {
  const [data, setData] = useState<UiSchemaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (tableName: string): Promise<UiSchemaResponse | null> => {
      if (!tableName) return null;
      try {
        setLoading(true);
        setError(null);
        const d = await dynamicService.getSchema(tableName);
        setData(d);
        return d;
      } catch (e: any) {
        setError(e.message || "Failed to load schema");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, load, setData };
}

export function useAddDynamicField() {
  const [loading, setLoading] = useState(false);

  const addField = useCallback(
    async (payload: UpsertFieldPayload): Promise<ApiSuccess> => {
      setLoading(true);
      try {
        return await dynamicService.upsertField(payload);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { addField, loading };
}

export function useRemoveDynamicField() {
  const [loading, setLoading] = useState(false);

  const removeField = useCallback(
    async (payload: RemoveFieldPayload): Promise<ApiSuccess> => {
      setLoading(true);
      try {
        return await dynamicService.removeField(payload);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { removeField, loading };
}

export function useReorderDynamicFields() {
  const [loading, setLoading] = useState(false);

  const reorder = useCallback(
    async (payload: ReorderFieldsPayload): Promise<ApiSuccess> => {
      setLoading(true);
      try {
        // try server endpoint first
        try {
          return await dynamicService.reorderFields(payload);
        } catch {
          // fallback to per-item upserts
          return await dynamicService.reorderFieldsFallback(payload);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { reorder, loading };
}
