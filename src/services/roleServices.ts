// services/roleService.ts
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

export const roleService = {
  // Get all roles
  async getAllRoles() {
    const res = await fetch(`${baseUrl}roles`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
  // Get all role names
  async getRoleNames() {
    const res = await fetch(`${baseUrl}roles/names`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get all GUI names
  async getGuiNames() {
    const res = await fetch(`${baseUrl}roles/gui`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get GUI by role name
  async getGuiByRoleName(roleName: string) {
    const res = await fetch(`${baseUrl}roles/gui/${roleName}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Create roles
  async createRoles(roleDtos: any[]) {
    const res = await fetch(`${baseUrl}roles`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(roleDtos),
    });
    return handleResponse(res);
  },

  // Update role by ID
  async updateRoleById(id: number, roleDto: any) {
    const res = await fetch(`${baseUrl}roles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(roleDto),
    });
    return handleResponse(res);
  },

  // Update role (general)
  async updateRole(roleData: any) {
    const res = await fetch(`${baseUrl}roles`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(roleData),
    });
    return handleResponse(res);
  },

  // Delete role by ID
  async deleteRoleById(id: number) {
    const res = await fetch(`${baseUrl}roles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
