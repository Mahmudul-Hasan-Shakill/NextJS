// services/physicalService.ts
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

export const physicalService = {
  // Create physical server
  async createPhysical(createPhysicalDto: any) {
    const res = await fetch(`${baseUrl}physical`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createPhysicalDto),
    });
    return handleResponse(res);
  },

  // Get all physical servers
  async getAllPhysicals() {
    const res = await fetch(`${baseUrl}physical`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get physical server by ID
  async getPhysical(id: number) {
    const res = await fetch(`${baseUrl}physical/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update physical server by ID
  async updatePhysical(id: number, updatePhysicalDto: any) {
    const res = await fetch(`${baseUrl}physical/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updatePhysicalDto),
    });
    return handleResponse(res);
  },

  // Delete physical server by ID
  async deletePhysical(id: number) {
    const res = await fetch(`${baseUrl}physical/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
