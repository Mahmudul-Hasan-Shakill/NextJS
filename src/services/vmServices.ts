// services/vmService.ts
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

export const vmService = {
  // Create VM
  async createVm(createVmDto: any) {
    const res = await fetch(`${baseUrl}vm`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createVmDto),
    });
    return handleResponse(res);
  },

  // Get all VMs
  async getAllVms() {
    const res = await fetch(`${baseUrl}vm`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get VM by ID
  async getVm(id: number) {
    const res = await fetch(`${baseUrl}vm/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update VM by ID
  async updateVm(id: number, updateVmDto: any) {
    const res = await fetch(`${baseUrl}vm/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateVmDto),
    });
    return handleResponse(res);
  },

  // Delete VM by ID
  async deleteVm(id: number) {
    const res = await fetch(`${baseUrl}vm/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
