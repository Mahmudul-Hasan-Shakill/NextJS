// services/authService.ts
import Cookies from "js-cookie";
import { encrypt, decrypt } from "./secretService";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
let refreshTimer: NodeJS.Timeout | null = null;

const getAuthHeaders = () => {
  const token = Cookies.get("ACSTKN");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const registerService = async (createUser: any) => {
  const res = await fetch(`${baseUrl}auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(createUser),
  });

  return await res.json();
};

const loginService = async (loginObj: any) => {
  const res = await fetch(`${baseUrl}auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginObj),
  });

  const data = await res.json();

  if (data.isSuccessful) {
    const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
    const expiryTimestamp = Date.now() + expiresIn * 1000;
    const encryptedExpiry = encrypt(expiryTimestamp.toString());

    Cookies.set("TKNEXP", encryptedExpiry, {
      expires: new Date(expiryTimestamp),
      path: "/",
      sameSite: "Lax",
    });

    console.log("[Login] Starting refresh timer for", expiresIn, "seconds");
    startTokenRefresh(expiresIn);
  }

  return data;
};

const logoutService = async () => {
  clearRefreshTimer();

  const res = await fetch(`${baseUrl}auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({}),
  });

  const data = await res.json();

  if (data.isSuccessful) {
    Cookies.remove("TKNEXP");
    console.log("[Logout] TKNEXP cookie cleared.");
  }

  return data;
};

const refreshAccessToken = async () => {
  const encryptedPin = Cookies.get("USRPIN");
  if (!encryptedPin) {
    console.warn("[Refresh] No USRPIN found in cookies.");
    return;
  }

  const pin = decrypt(encryptedPin);
  console.log("[Refresh] Attempting token refresh for PIN:", pin);

  try {
    const res = await fetch(`${baseUrl}auth/refresh/${pin}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (data.isSuccessful) {
      const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
      const expiryTimestamp = Date.now() + expiresIn * 1000;
      const encryptedExpiry = encrypt(expiryTimestamp.toString());

      Cookies.set("TKNEXP", encryptedExpiry, {
        expires: new Date(expiryTimestamp),
        path: "/",
        sameSite: "Lax",
      });

      console.log("[Refresh] Token refreshed at", new Date().toISOString());
      startTokenRefresh(expiresIn);
    } else {
      console.warn("[Refresh] Refresh response not successful");
    }
  } catch (err) {
    console.error("[Refresh] Token refresh failed:", err);
    clearRefreshTimer();
  }
};

const startTokenRefresh = (expiresInSeconds: number) => {
  clearRefreshTimer();
  const refreshTimeMs = (expiresInSeconds - 30) * 1000;

  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, refreshTimeMs);

  console.log("[Timer] Refresh timer set for", refreshTimeMs / 1000, "seconds");
};

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("[Timer] Cleared existing refresh timer");
  }
};

const resumeRefreshTimerFromCookie = () => {
  const expiry = Cookies.get("TKNEXP");
  if (!expiry) {
    console.warn("[Resume] TKNEXP cookie not found.");
    return;
  }

  let expiryStr: string;
  try {
    expiryStr = decrypt(expiry);
  } catch (error) {
    console.error("[Resume] Decryption failed:", error);
    return;
  }

  const expiryTimestamp = parseInt(expiryStr, 10);
  const remainingMs = expiryTimestamp - Date.now();

  if (remainingMs > 30 * 1000) {
    console.log(
      "[Resume] Resuming refresh timer with",
      remainingMs / 1000,
      "seconds left"
    );
    startTokenRefresh(remainingMs / 1000);
  } else if (remainingMs > 0) {
    console.log("[Resume] Token near expiry, refreshing immediately");
    refreshAccessToken();
  } else {
    console.warn("[Resume] Token already expired");
  }
};

export const authService = {
  registerService,
  loginService,
  logoutService,
  resumeRefreshTimerFromCookie,
};
