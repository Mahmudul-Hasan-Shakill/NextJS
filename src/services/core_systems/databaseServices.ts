// services/databaseService.ts
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

export const databaseService = {
  // Create database
  async createDatabase(createDatabaseDto: any) {
    const res = await fetch(`${baseUrl}database`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createDatabaseDto),
    });
    return handleResponse(res);
  },

  // Get all databases
  async getAllDatabases() {
    const res = await fetch(`${baseUrl}database`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get database by ID
  async getDatabase(id: number) {
    const res = await fetch(`${baseUrl}database/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update database by ID
  async updateDatabase(id: number, updateDatabaseDto: any) {
    const res = await fetch(`${baseUrl}database/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateDatabaseDto),
    });
    return handleResponse(res);
  },

  // Delete database by ID
  async deleteDatabase(id: number) {
    const res = await fetch(`${baseUrl}database/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
