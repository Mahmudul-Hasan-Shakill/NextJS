// services/core_systems/filesystemServices.ts
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = () => {
  const token = Cookies.get("ACSTKN");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const filesystemService = {
  async createFilesystem(payload: any) {
    const res = await fetch(`${baseUrl}filesystem`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getAllFilesystems() {
    const res = await fetch(`${baseUrl}filesystem`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getFilesystem(id: number) {
    const res = await fetch(`${baseUrl}filesystem/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async updateFilesystem(id: number, payload: any) {
    const res = await fetch(`${baseUrl}filesystem/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteFilesystem(id: number) {
    const res = await fetch(`${baseUrl}filesystem/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
