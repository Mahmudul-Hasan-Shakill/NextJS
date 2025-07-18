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

export const automationService = {
  // Create Automation
  async createAutomation(createAutomationDto: any) {
    const res = await fetch(`${baseUrl}automation`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(createAutomationDto),
    });
    return handleResponse(res);
  },

  // Get all Automations
  async getAllAutomations() {
    const res = await fetch(`${baseUrl}automation`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Get Automation by ID
  async getAutomation(id: number) {
    const res = await fetch(`${baseUrl}automation/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Update Automation by ID
  async updateAutomation(id: number, updateAutomationDto: any) {
    const res = await fetch(`${baseUrl}automation/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateAutomationDto),
    });
    return handleResponse(res);
  },

  // Delete Automation by ID
  async deleteAutomation(id: number) {
    const res = await fetch(`${baseUrl}automation/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async uploadParseAutomation(formData: FormData) {
    const res = await fetch(`${baseUrl}automation/upload-parse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("ACSTKN") || ""}`,
      },
      credentials: "include",
      body: formData,
    });
    return handleResponse(res);
  },
};
