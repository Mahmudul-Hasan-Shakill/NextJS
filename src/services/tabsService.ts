// src/services/tabsService.ts
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Match your existing pattern: when ACSTKN is not httpOnly (dev), send Bearer.
// When httpOnly (prod), cookies will ride with credentials: 'include'.
const SEND_BEARER =
  String(process.env.NEXT_PUBLIC_AUTH_SEND_BEARER ?? "true").toLowerCase() ===
  "true";

const getAuthHeaders = (): Record<string, string> => {
  if (!SEND_BEARER) return {};
  const token = Cookies.get("ACSTKN");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type VisibleTab = { key: string; label: string };

export async function fetchVisibleTabs(): Promise<VisibleTab[]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  const res = await fetch(`${baseUrl}dashboard/tabs`, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
  });

  // Helpful diagnostics during setup
  if (res.status === 401) {
    // Most common: ACSTKN missing/expired or cookie domain mismatch
    console.warn(
      "[tabsService] 401 Unauthorized. Bearer sent:",
      Boolean(headers.Authorization),
      " ACSTKN cookie exists:",
      Boolean(Cookies.get("ACSTKN"))
    );
  }

  const data = await res.json();

  if (!res.ok || !data?.isSuccessful || !Array.isArray(data.data)) {
    throw new Error(
      data?.message || `Failed to load tabs (status ${res.status})`
    );
  }

  const list: VisibleTab[] = data.data;
  const hasDashboard = list.some((t) => t.key === "dashboard");
  return hasDashboard
    ? list
    : [{ key: "dashboard", label: "Dashboard" }, ...list];
}
