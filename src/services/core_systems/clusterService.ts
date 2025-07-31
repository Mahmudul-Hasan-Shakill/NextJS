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

export const clusterService = {
  async createCluster(createClusterDto: any) {
    const res = await fetch(`${baseUrl}cluster`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createClusterDto),
    });
    return handleResponse(res);
  },

  async getAllClusters() {
    const res = await fetch(`${baseUrl}cluster`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getCluster(id: number) {
    const res = await fetch(`${baseUrl}cluster/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async updateCluster(id: number, updateClusterDto: any) {
    const res = await fetch(`${baseUrl}cluster/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateClusterDto),
    });
    return handleResponse(res);
  },

  async deleteCluster(id: number) {
    const res = await fetch(`${baseUrl}cluster/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
