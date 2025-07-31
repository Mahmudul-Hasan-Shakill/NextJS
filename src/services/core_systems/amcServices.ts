import Cookies from "js-cookie";
import {
  AmcCreatePayload,
  AmcUpdatePayload,
  AmcQueryParams,
  AmcData,
} from "@/types/amc";
import { BackendResponse } from "@/types/backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = (contentType: string = "application/json") => {
  const token = Cookies.get("ACSTKN");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": contentType,
  };
};

const handleResponse = async <T>(
  res: Response
): Promise<BackendResponse<T>> => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as BackendResponse<T>;
};

export const amcService = {
  async createAmc(
    createAmcDto: AmcCreatePayload
  ): Promise<BackendResponse<AmcData>> {
    const res = await fetch(`${baseUrl}amc`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createAmcDto),
    });
    return handleResponse<AmcData>(res);
  },

  async getAllAmc(
    queryParams?: AmcQueryParams
  ): Promise<BackendResponse<AmcData[]>> {
    const queryString = queryParams
      ? "?" + new URLSearchParams(queryParams as any).toString()
      : "";
    const res = await fetch(`${baseUrl}amc${queryString}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<AmcData[]>(res);
  },

  async getAmc(id: number): Promise<BackendResponse<AmcData>> {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<AmcData>(res);
  },

  async updateAmc(
    id: number,
    updateAmcDto: AmcUpdatePayload
  ): Promise<BackendResponse<AmcData>> {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateAmcDto),
    });
    return handleResponse<AmcData>(res);
  },

  async deleteAmc(id: number): Promise<BackendResponse<null>> {
    const res = await fetch(`${baseUrl}amc/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<null>(res);
  },
};
