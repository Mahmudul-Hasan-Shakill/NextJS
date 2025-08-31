// /services/core_systems/deviceServices.ts
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = Cookies.get("ACSTKN");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.details)) ||
      "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const deviceService = {
  async createDevice(payload: any) {
    const res = await fetch(`${baseUrl}device`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getAllDevices() {
    const res = await fetch(`${baseUrl}device`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getDevice(id: number) {
    const res = await fetch(`${baseUrl}device/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async updateDevice(id: number, payload: any) {
    const res = await fetch(`${baseUrl}device/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteDevice(id: number) {
    const res = await fetch(`${baseUrl}device/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
