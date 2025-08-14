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

export const physicalHostService = {
  // Create physical host
  async createPhysicalHost(createDto: any) {
    const res = await fetch(`${baseUrl}physical-hosts`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createDto),
    });
    return handleResponse(res);
  },

  // Get all physical hosts
  async getAllPhysicalHosts() {
    const res = await fetch(`${baseUrl}physical-hosts`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get physical host by ID
  async getPhysicalHost(id: number) {
    const res = await fetch(`${baseUrl}physical-hosts/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update physical host by ID
  async updatePhysicalHost(id: number, updateDto: any) {
    const res = await fetch(`${baseUrl}physical-hosts/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateDto),
    });
    return handleResponse(res);
  },

  // Delete physical host by ID
  async deletePhysicalHost(id: number) {
    const res = await fetch(`${baseUrl}physical-hosts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get physical hosts summary
  async getPhysicalHostsSummary() {
    const res = await fetch(`${baseUrl}physical-hosts/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
  
};
