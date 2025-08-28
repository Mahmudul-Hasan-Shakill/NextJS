// services/dynamicServices.ts
import Cookies from "js-cookie";
import {
  ApiSuccess,
  UpsertFieldPayload,
  RemoveFieldPayload,
  UiSchemaResponse,
  ReorderFieldsPayload,
} from "@/types/dynamic";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = () => {
  const token = Cookies.get("ACSTKN");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const handleResponse = async (res: Response) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data as ApiSuccess;
};

export const dynamicService = {
  // Create or update a single field
  async upsertField(payload: UpsertFieldPayload) {
    const res = await fetch(`${baseUrl}dynamic-fields/upsert`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Remove (deactivate) a field
  async removeField(payload: RemoveFieldPayload) {
    const res = await fetch(`${baseUrl}dynamic-fields/remove`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Get UI schema for a table (active fields only)
  async getSchema(tableName: string) {
    const res = await fetch(`${baseUrl}dynamic-fields/${tableName}/schema`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const msg = json?.message || "Request failed";
      throw new Error(msg);
    }

    // Accept both shapes:
    // 1) enveloped: { isSuccessful, message, data: { table, fields } }
    // 2) bare:      { table, fields }
    const payload = json?.data && json?.isSuccessful ? json.data : json;
    return payload as UiSchemaResponse;
  },

  // Optional: get raw list (active + inactive) if you have it
  async listFields(tableName: string) {
    const res = await fetch(`${baseUrl}dynamic-fields/${tableName}/list`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Reorder in one hit (preferred)
  async reorderFields(payload: ReorderFieldsPayload) {
    const res = await fetch(`${baseUrl}dynamic-fields/reorder`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Fallback: if you don't have /reorder, batch-upsert new sortOrders
  async reorderFieldsFallback(payload: ReorderFieldsPayload) {
    // upsert each item with new sortOrder
    const results = [];
    for (const item of payload.items) {
      results.push(
        await this.upsertField({
          tableName: payload.tableName,
          fieldName: item.fieldName,
          sortOrder: item.sortOrder,
        })
      );
    }
    return {
      isSuccessful: true,
      message: "Order updated (fallback)",
      data: results,
    } as ApiSuccess;
  },
};
