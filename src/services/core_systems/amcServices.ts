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

export const amcService = {
  // Create AMC
  async createAmc(createAmcDto: any) {
    const res = await fetch(`${baseUrl}amc`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createAmcDto),
    });
    return handleResponse(res);
  },

  // Get all AMCs
  async getAllAmcs() {
    const res = await fetch(`${baseUrl}amc`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get AMC by ID
  async getAmc(id: number) {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update AMC by ID
  async updateAmc(id: number, updateAmcDto: any) {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateAmcDto),
    });
    return handleResponse(res);
  },

  // Delete AMC by ID
  async deleteAmc(id: number) {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
