// services/applicationService.ts
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

export const applicationService = {
  // Create application
  async createApplication(createApplicationDto: any) {
    const res = await fetch(`${baseUrl}application`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createApplicationDto),
    });
    return handleResponse(res);
  },

  // Get all applications
  async getAllApplications() {
    const res = await fetch(`${baseUrl}application`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get application by ID
  async getApplication(id: number) {
    const res = await fetch(`${baseUrl}application/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update application by ID
  async updateApplication(id: number, updateApplicationDto: any) {
    const res = await fetch(`${baseUrl}application/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateApplicationDto),
    });
    return handleResponse(res);
  },

  // Delete application by ID
  async deleteApplication(id: number) {
    const res = await fetch(`${baseUrl}application/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
