// // services/authService.ts
// import Cookies from "js-cookie";
// import { encrypt, decrypt } from "./secretService";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// let refreshTimer: NodeJS.Timeout | null = null;

// const getAuthHeaders = () => {
//   const token = Cookies.get("ACSTKN");
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// const registerService = async (createUser: any) => {
//   const res = await fetch(`${baseUrl}auth/register`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     },
//     body: JSON.stringify(createUser),
//   });

//   return await res.json();
// };

// const loginService = async (loginObj: any) => {
//   const res = await fetch(`${baseUrl}auth/login`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(loginObj),
//   });

//   const data = await res.json();

//   if (data.isSuccessful) {
//     const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
//     const expiryTimestamp = Date.now() + expiresIn * 1000;
//     const encryptedExpiry = encrypt(expiryTimestamp.toString());

//     Cookies.set("TKNEXP", encryptedExpiry, {
//       expires: new Date(expiryTimestamp),
//       path: "/",
//       sameSite: "Lax",
//     });

//     console.log("[Login] Starting refresh timer for", expiresIn, "seconds");
//     startTokenRefresh(expiresIn);
//   }

//   return data;
// };

// const logoutService = async () => {
//   clearRefreshTimer();

//   const res = await fetch(`${baseUrl}auth/logout`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     },
//   });

//   const data = await res.json();

//   if (data.isSuccessful) {
//     Cookies.remove("TKNEXP");
//     console.log("[Logout] TKNEXP cookie cleared.");
//   }

//   return data;
// };

// let onSessionExpiredCallback: (() => void) | null = null;

// export const setSessionExpiredHandler = (callback: () => void) => {
//   onSessionExpiredCallback = callback;
// };

// const handleForcedLogout = async () => {
//   clearRefreshTimer();

//   try {
//     const res = await fetch(`${baseUrl}auth/logout`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeaders(),
//       },
//     });

//     const data = await res.json();
//     if (data.isSuccessful) {
//       console.log(
//         "[Logout] Logout API called successfully during forced logout."
//       );
//     } else {
//       console.warn("[Logout] Logout API responded but not successful.");
//     }
//   } catch (err) {
//     console.error(
//       "[Logout] Failed to call logout API during forced logout:",
//       err
//     );
//   }

//   Cookies.remove("TKNEXP");

//   if (onSessionExpiredCallback) {
//     onSessionExpiredCallback();
//   } else {
//     window.location.href = "/";
//   }
// };

// const refreshAccessToken = async () => {
//   const encryptedPin = Cookies.get("USRPIN");
//   if (!encryptedPin) {
//     console.warn("[Refresh] No USRPIN found in cookies.");
//     return;
//   }

//   const pin = decrypt(encryptedPin);
//   console.log("[Refresh] Attempting token refresh for PIN:", pin);

//   try {
//     const res = await fetch(`${baseUrl}auth/refresh/${pin}`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (data.isSuccessful) {
//       const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
//       const expiryTimestamp = Date.now() + expiresIn * 1000;
//       const encryptedExpiry = encrypt(expiryTimestamp.toString());

//       Cookies.set("TKNEXP", encryptedExpiry, {
//         expires: new Date(expiryTimestamp),
//         path: "/",
//         sameSite: "Lax",
//       });

//       console.log("[Refresh] Token refreshed at", new Date().toISOString());
//       startTokenRefresh(expiresIn);
//     } else {
//       console.warn("[Refresh] Refresh response not successful");
//       handleForcedLogout();
//     }
//   } catch (err) {
//     console.error("[Refresh] Token refresh failed:", err);
//     handleForcedLogout();
//   }
// };

// const startTokenRefresh = (expiresInSeconds: number) => {
//   clearRefreshTimer();
//   const refreshTimeMs = (expiresInSeconds - 30) * 1000;

//   refreshTimer = setTimeout(() => {
//     refreshAccessToken();
//   }, refreshTimeMs);

//   console.log("[Timer] Refresh timer set for", refreshTimeMs / 1000, "seconds");
// };

// const clearRefreshTimer = () => {
//   if (refreshTimer) {
//     clearTimeout(refreshTimer);
//     refreshTimer = null;
//     console.log("[Timer] Cleared existing refresh timer");
//   }
// };

// const resumeRefreshTimerFromCookie = ({
//   onSessionExpired,
// }: { onSessionExpired?: () => void } = {}) => {
//   const expiry = Cookies.get("TKNEXP");
//   if (!expiry) {
//     console.warn("[Resume] TKNEXP cookie not found.");
//     onSessionExpired?.();
//     return;
//   }

//   let expiryStr: string;
//   try {
//     expiryStr = decrypt(expiry);
//   } catch (error) {
//     console.error("[Resume] Decryption failed:", error);
//     onSessionExpired?.();
//     return;
//   }

//   const expiryTimestamp = parseInt(expiryStr, 10);
//   const remainingMs = expiryTimestamp - Date.now();

//   if (remainingMs > 30 * 1000) {
//     console.log(
//       "[Resume] Resuming refresh timer with",
//       remainingMs / 1000,
//       "seconds left"
//     );
//     startTokenRefresh(remainingMs / 1000);
//   } else if (remainingMs > 0) {
//     console.log("[Resume] Token near expiry, refreshing immediately");
//     refreshAccessToken().catch(() => {
//       onSessionExpired?.();
//     });
//   } else {
//     console.warn("[Resume] Token already expired");
//     onSessionExpired?.();
//   }
// };

// export const authService = {
//   registerService,
//   loginService,
//   logoutService,
//   resumeRefreshTimerFromCookie,
// };

// services/authService.ts
import Cookies from "js-cookie";
import { encrypt, decrypt } from "./secretService";
import { setClientCookie, removeClientCookie } from "./cookieClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
let refreshTimer: NodeJS.Timeout | null = null;

// If you plan to make ACSTKN httpOnly in prod, set NEXT_PUBLIC_AUTH_SEND_BEARER=false there.
const SEND_BEARER =
  String(process.env.NEXT_PUBLIC_AUTH_SEND_BEARER ?? "true").toLowerCase() ===
  "true";

/** Always return a plain Record<string,string> (no unions). */
const getAuthHeaders = (): Record<string, string> => {
  if (!SEND_BEARER) return {};
  const token = Cookies.get("ACSTKN"); // only available if not httpOnly
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** REGISTER */
const registerService = async (createUser: any) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  const res = await fetch(`${baseUrl}auth/register`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(createUser),
  });

  return await res.json();
};

/** LOGIN */
const loginService = async (loginObj: any) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json", // no auth yet
  };

  const res = await fetch(`${baseUrl}auth/login`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(loginObj),
  });

  const data = await res.json();

  if (data.isSuccessful) {
    const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
    const expiryTimestamp = Date.now() + expiresIn * 1000;
    const encryptedExpiry = encrypt(expiryTimestamp.toString());

    // Env-driven cookie attrs via cookieClient
    setClientCookie("TKNEXP", encryptedExpiry, {
      expires: new Date(expiryTimestamp),
    });

    startTokenRefresh(expiresIn);
  }

  return data;
};

/** LOGOUT */
const logoutService = async () => {
  clearRefreshTimer();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  const res = await fetch(`${baseUrl}auth/logout`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  const data = await res.json();

  if (data.isSuccessful) {
    removeClientCookie("TKNEXP");
  }

  return data;
};

/** SESSION EXPIRE HANDLER */
let onSessionExpiredCallback: (() => void) | null = null;

export const setSessionExpiredHandler = (callback: () => void) => {
  onSessionExpiredCallback = callback;
};

/** FORCED LOGOUT (on refresh failure) */
const handleForcedLogout = async () => {
  clearRefreshTimer();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };

    await fetch(`${baseUrl}auth/logout`, {
      method: "POST",
      credentials: "include",
      headers,
    }).then((r) => r.json());
  } catch {
    // ignore network errors
  }

  removeClientCookie("TKNEXP");

  if (onSessionExpiredCallback) onSessionExpiredCallback();
  else if (typeof window !== "undefined") window.location.href = "/";
};

/** REFRESH */
const refreshAccessToken = async () => {
  const encryptedPin = Cookies.get("USRPIN"); // only if not httpOnly
  if (!encryptedPin) return;

  const pin = decrypt(encryptedPin);

  try {
    const res = await fetch(`${baseUrl}auth/refresh/${pin}`, {
      method: "GET",
      credentials: "include",
      // no headers needed; cookies ride along via credentials
    });

    const data = await res.json();

    if (data.isSuccessful) {
      const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
      const expiryTimestamp = Date.now() + expiresIn * 1000;
      const encryptedExpiry = encrypt(expiryTimestamp.toString());

      setClientCookie("TKNEXP", encryptedExpiry, {
        expires: new Date(expiryTimestamp),
      });

      startTokenRefresh(expiresIn);
    } else {
      handleForcedLogout();
    }
  } catch {
    handleForcedLogout();
  }
};

/** TIMER MGMT */
const startTokenRefresh = (expiresInSeconds: number) => {
  clearRefreshTimer();
  const refreshTimeMs = Math.max(1_000, (expiresInSeconds - 30) * 1000);
  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, refreshTimeMs);
};

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const resumeRefreshTimerFromCookie = ({
  onSessionExpired,
}: {
  onSessionExpired?: () => void;
} = {}) => {
  const expiry = Cookies.get("TKNEXP");
  if (!expiry) {
    onSessionExpired?.();
    return;
  }

  let expiryStr: string;
  try {
    expiryStr = decrypt(expiry);
  } catch {
    onSessionExpired?.();
    return;
  }

  const expiryTimestamp = parseInt(expiryStr, 10);
  const remainingMs = expiryTimestamp - Date.now();

  if (remainingMs > 30_000) {
    startTokenRefresh(remainingMs / 1000);
  } else if (remainingMs > 0) {
    refreshAccessToken().catch(() => onSessionExpired?.());
  } else {
    onSessionExpired?.();
  }
};

export const authService = {
  registerService,
  loginService,
  logoutService,
  resumeRefreshTimerFromCookie,
};
