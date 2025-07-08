// services/userService.ts
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

export const userService = {
  // Get user by ID
  async getUser(id: number) {
    const res = await fetch(`${baseUrl}user/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async selfRegister(createUser: any) {
    const res = await fetch(`${baseUrl}user/self-register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createUser),
    });

    return await res.json();
  },

  // Get all users
  async getAllUsers() {
    const res = await fetch(`${baseUrl}user`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update user by ID
  async updateUser(id: number, updateUserDto: any) {
    const res = await fetch(`${baseUrl}user/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateUserDto),
    });
    return handleResponse(res);
  },

  // Update user by PIN
  async updateUserByPin(pin: string, updateUserDto: any) {
    const res = await fetch(`${baseUrl}user/pin/${pin}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateUserDto),
    });
    return handleResponse(res);
  },

  // Delete user by ID
  async deleteUser(id: number) {
    const res = await fetch(`${baseUrl}user/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get user by PIN
  async getUserByPin(pin: string) {
    const res = await fetch(`${baseUrl}user/pin/${pin}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Reset password by PIN
  async resetPassword(pin: string) {
    const res = await fetch(`${baseUrl}user/reset-password/${pin}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({}),
    });
    return handleResponse(res);
  },

  // Change password by PIN
  async changePassword(pin: string, updateUserDto: any) {
    const res = await fetch(`${baseUrl}user/change-password/${pin}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateUserDto),
    });
    return handleResponse(res);
  },
};
