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

// // services/authService.ts
// import Cookies from "js-cookie";
// import { encrypt, decrypt } from "./secretService";
// import { setClientCookie, removeClientCookie } from "./cookieClient";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// let refreshTimer: NodeJS.Timeout | null = null;

// // If you plan to make ACSTKN httpOnly in prod, set NEXT_PUBLIC_AUTH_SEND_BEARER=false there.
// const SEND_BEARER =
//   String(process.env.NEXT_PUBLIC_AUTH_SEND_BEARER ?? "true").toLowerCase() ===
//   "true";

// /** Always return a plain Record<string,string> (no unions). */
// const getAuthHeaders = (): Record<string, string> => {
//   if (!SEND_BEARER) return {};
//   const token = Cookies.get("ACSTKN"); // only available if not httpOnly
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// /** REGISTER */
// const registerService = async (createUser: any) => {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...getAuthHeaders(),
//   };

//   const res = await fetch(`${baseUrl}auth/register`, {
//     method: "POST",
//     credentials: "include",
//     headers,
//     body: JSON.stringify(createUser),
//   });

//   return await res.json();
// };

// /** LOGIN */
// const loginService = async (loginObj: any) => {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json", // no auth yet
//   };

//   const res = await fetch(`${baseUrl}auth/login`, {
//     method: "POST",
//     credentials: "include",
//     headers,
//     body: JSON.stringify(loginObj),
//   });

//   const data = await res.json();

//   if (data.isSuccessful) {
//     const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
//     const expiryTimestamp = Date.now() + expiresIn * 1000;
//     const encryptedExpiry = encrypt(expiryTimestamp.toString());

//     // Env-driven cookie attrs via cookieClient
//     setClientCookie("TKNEXP", encryptedExpiry, {
//       expires: new Date(expiryTimestamp),
//     });

//     startTokenRefresh(expiresIn);
//   }

//   return data;
// };

// /** LOGOUT */
// const logoutService = async () => {
//   clearRefreshTimer();

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...getAuthHeaders(),
//   };

//   const res = await fetch(`${baseUrl}auth/logout`, {
//     method: "POST",
//     credentials: "include",
//     headers,
//   });

//   const data = await res.json();

//   if (data.isSuccessful) {
//     removeClientCookie("TKNEXP");
//   }

//   return data;
// };

// /** SESSION EXPIRE HANDLER */
// let onSessionExpiredCallback: (() => void) | null = null;

// export const setSessionExpiredHandler = (callback: () => void) => {
//   onSessionExpiredCallback = callback;
// };

// /** FORCED LOGOUT (on refresh failure) */
// const handleForcedLogout = async () => {
//   clearRefreshTimer();

//   try {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     };

//     await fetch(`${baseUrl}auth/logout`, {
//       method: "POST",
//       credentials: "include",
//       headers,
//     }).then((r) => r.json());
//   } catch {
//     // ignore network errors
//   }

//   removeClientCookie("TKNEXP");

//   if (onSessionExpiredCallback) onSessionExpiredCallback();
//   else if (typeof window !== "undefined") window.location.href = "/";
// };

// /** REFRESH */
// const refreshAccessToken = async () => {
//   const encryptedPin = Cookies.get("USRPIN"); // only if not httpOnly
//   if (!encryptedPin) return;

//   const pin = decrypt(encryptedPin);

//   try {
//     const res = await fetch(`${baseUrl}auth/refresh/${pin}`, {
//       method: "GET",
//       credentials: "include",
//       // no headers needed; cookies ride along via credentials
//     });

//     const data = await res.json();

//     if (data.isSuccessful) {
//       const expiresIn = parseInt(data.data.expiresIn.replace("s", ""), 10);
//       const expiryTimestamp = Date.now() + expiresIn * 1000;
//       const encryptedExpiry = encrypt(expiryTimestamp.toString());

//       setClientCookie("TKNEXP", encryptedExpiry, {
//         expires: new Date(expiryTimestamp),
//       });

//       startTokenRefresh(expiresIn);
//     } else {
//       handleForcedLogout();
//     }
//   } catch {
//     handleForcedLogout();
//   }
// };

// /** TIMER MGMT */
// const startTokenRefresh = (expiresInSeconds: number) => {
//   clearRefreshTimer();
//   const refreshTimeMs = Math.max(1_000, (expiresInSeconds - 30) * 1000);
//   refreshTimer = setTimeout(() => {
//     refreshAccessToken();
//   }, refreshTimeMs);
// };

// const clearRefreshTimer = () => {
//   if (refreshTimer) {
//     clearTimeout(refreshTimer);
//     refreshTimer = null;
//   }
// };

// const resumeRefreshTimerFromCookie = ({
//   onSessionExpired,
// }: {
//   onSessionExpired?: () => void;
// } = {}) => {
//   const expiry = Cookies.get("TKNEXP");
//   if (!expiry) {
//     onSessionExpired?.();
//     return;
//   }

//   let expiryStr: string;
//   try {
//     expiryStr = decrypt(expiry);
//   } catch {
//     onSessionExpired?.();
//     return;
//   }

//   const expiryTimestamp = parseInt(expiryStr, 10);
//   const remainingMs = expiryTimestamp - Date.now();

//   if (remainingMs > 30_000) {
//     startTokenRefresh(remainingMs / 1000);
//   } else if (remainingMs > 0) {
//     refreshAccessToken().catch(() => onSessionExpired?.());
//   } else {
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

// If ACSTKN is httpOnly in prod, set NEXT_PUBLIC_AUTH_SEND_BEARER=false in .env
const SEND_BEARER =
  String(process.env.NEXT_PUBLIC_AUTH_SEND_BEARER ?? "true").toLowerCase() ===
  "true";

// Mirror role to a readable cookie so UI can react to it over time
const MIRROR_ROLE =
  String(
    process.env.NEXT_PUBLIC_MIRROR_ROLE_ON_CLIENT ?? "true"
  ).toLowerCase() === "true";

/** Always return a plain Record<string,string> (no unions). */
const getAuthHeaders = (): Record<string, string> => {
  if (!SEND_BEARER) {
    // Intentionally quiet to avoid log spam in every call; uncomment if needed
    // console.log("[AuthHeaders] SEND_BEARER=false; not attaching Authorization.");
    return {};
  }
  const token = Cookies.get("ACSTKN"); // only available if not httpOnly
  if (token) {
    // uncomment for verbose debug
    // console.log("[AuthHeaders] Found ACSTKN; attaching Authorization header");
    return { Authorization: `Bearer ${token}` };
  }
  // console.log("[AuthHeaders] No ACSTKN cookie found (likely httpOnly).");
  return {};
};

/** Helper: mirror the role into a client cookie (encrypted for parity). */
const mirrorRoleCookie = (
  role: string | undefined,
  expiryTs: number,
  source: "login" | "refresh"
) => {
  if (!MIRROR_ROLE) {
    console.log(`[Role] MIRROR_ROLE=false; skipping role mirror on ${source}.`);
    return;
  }
  if (!role) {
    console.warn(
      `[Role] No role provided by server on ${source}; skip mirroring.`
    );
    return;
  }
  const encryptedRole = encrypt(role);
  setClientCookie("USRROLE", encryptedRole, { expires: new Date(expiryTs) });
  console.log(`[Role] Mirrored role to cookie (USRROLE) on ${source}:`, role);
};

/** REGISTER */
const registerService = async (createUser: any) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  console.log("[Register] Calling /auth/register");
  const res = await fetch(`${baseUrl}auth/register`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(createUser),
  });

  const data = await res.json();
  if (!res.ok) {
    console.warn("[Register] Failed:", data);
  } else {
    console.log("[Register] Success");
  }
  return data;
};

/** LOGIN */
const loginService = async (loginObj: any) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json", // no auth yet
  };

  console.log("[Login] Calling /auth/login with credentials");
  const res = await fetch(`${baseUrl}auth/login`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(loginObj),
  });

  const data = await res.json();

  if (data.isSuccessful) {
    const expiresIn = parseInt(
      String(data.data.expiresIn).replace("s", ""),
      10
    );
    const expiryTimestamp = Date.now() + expiresIn * 1000;

    console.log("[Login] Successful. expiresIn:", expiresIn, "sec");
    console.log("[Login] Setting TKNEXP cookie (client-only timer)");
    setClientCookie("TKNEXP", encrypt(String(expiryTimestamp)), {
      expires: new Date(expiryTimestamp),
    });

    // Mirror role from login payload
    mirrorRoleCookie(data.data.role, expiryTimestamp, "login");

    console.log("[Login] Starting refresh timer for", expiresIn, "seconds");
    startTokenRefresh(expiresIn);
  } else {
    console.warn("[Login] Not successful:", data);
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

  console.log("[Logout] Calling /auth/logout");
  const res = await fetch(`${baseUrl}auth/logout`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  const data = await res.json();

  if (data.isSuccessful) {
    console.log(
      "[Logout] Success. Clearing client timer cookies (TKNEXP, USRROLE)."
    );
    removeClientCookie("TKNEXP");
    removeClientCookie("USRROLE");
  } else {
    console.warn("[Logout] API responded but not successful:", data);
  }

  return data;
};

/** SESSION EXPIRE HANDLER */
let onSessionExpiredCallback: (() => void) | null = null;

export const setSessionExpiredHandler = (callback: () => void) => {
  onSessionExpiredCallback = callback;
  console.log("[Session] onSessionExpired handler registered.");
};

/** FORCED LOGOUT (on refresh failure) */
const handleForcedLogout = async () => {
  clearRefreshTimer();
  console.warn("[Logout] Forced logout initiated (token refresh failed).");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };

    const r = await fetch(`${baseUrl}auth/logout`, {
      method: "POST",
      credentials: "include",
      headers,
    });
    const data = await r.json();
    if (data.isSuccessful) {
      console.log(
        "[Logout] Logout API called successfully during forced logout."
      );
    } else {
      console.warn(
        "[Logout] Logout API responded but not successful during forced logout:",
        data
      );
    }
  } catch (err) {
    console.error(
      "[Logout] Failed to call logout API during forced logout:",
      err
    );
  }

  console.log("[Logout] Clearing client-side cookies TKNEXP and USRROLE.");
  removeClientCookie("TKNEXP");
  removeClientCookie("USRROLE");

  if (onSessionExpiredCallback) {
    console.log("[Session] Triggering onSessionExpired callback.");
    onSessionExpiredCallback();
  } else {
    console.warn(
      "[Session] No session-expired callback set; redirecting to '/'."
    );
    if (typeof window !== "undefined") window.location.href = "/";
  }
};

/** REFRESH */
const refreshAccessToken = async () => {
  const encryptedPin = Cookies.get("USRPIN"); // only if not httpOnly
  if (!encryptedPin) {
    console.warn("[Refresh] No USRPIN found in cookies; cannot refresh.");
    return;
  }

  const pin = decrypt(encryptedPin);
  console.log("[Refresh] Attempting token refresh for PIN:", pin);

  try {
    const res = await fetch(`${baseUrl}auth/refresh/${pin}`, {
      method: "GET",
      credentials: "include", // server sets ACSTKN and other cookies
    });

    const data = await res.json();

    if (data.isSuccessful) {
      const expiresIn = parseInt(
        String(data.data.expiresIn).replace("s", ""),
        10
      );
      const expiryTimestamp = Date.now() + expiresIn * 1000;

      console.log("[Refresh] Success. New expiresIn:", expiresIn, "sec");
      console.log("[Refresh] Updating TKNEXP cookie and refresh timer.");
      setClientCookie("TKNEXP", encrypt(String(expiryTimestamp)), {
        expires: new Date(expiryTimestamp),
      });

      // Mirror role from server on every refresh
      mirrorRoleCookie(data.data.role, expiryTimestamp, "refresh");

      console.log("[Refresh] Token refreshed at", new Date().toISOString());
      startTokenRefresh(expiresIn);
    } else {
      console.warn("[Refresh] Refresh response not successful:", data);
      handleForcedLogout();
    }
  } catch (err) {
    console.error("[Refresh] Token refresh failed:", err);
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
  console.log("[Timer] Refresh timer set for", refreshTimeMs / 1000, "seconds");
};

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("[Timer] Cleared existing refresh timer");
  }
};

/** Resume timer from cookie (e.g., after reload) */
const resumeRefreshTimerFromCookie = ({
  onSessionExpired,
}: {
  onSessionExpired?: () => void;
} = {}) => {
  const expiry = Cookies.get("TKNEXP");
  if (!expiry) {
    console.warn("[Resume] TKNEXP cookie not found.");
    onSessionExpired?.();
    return;
  }

  let expiryStr: string;
  try {
    expiryStr = decrypt(expiry);
  } catch (error) {
    console.error("[Resume] Decryption failed for TKNEXP:", error);
    onSessionExpired?.();
    return;
  }

  const expiryTimestamp = parseInt(expiryStr, 10);
  const remainingMs = expiryTimestamp - Date.now();

  if (remainingMs > 30_000) {
    console.log(
      "[Resume] Resuming refresh timer with",
      remainingMs / 1000,
      "seconds left"
    );
    startTokenRefresh(remainingMs / 1000);
  } else if (remainingMs > 0) {
    console.log("[Resume] Token near expiry, refreshing immediately");
    refreshAccessToken().catch(() => {
      console.warn(
        "[Resume] Immediate refresh failed; calling onSessionExpired (if any)."
      );
      onSessionExpired?.();
    });
  } else {
    console.warn("[Resume] Token already expired");
    onSessionExpired?.();
  }
};

export const authService = {
  registerService,
  loginService,
  logoutService,
  resumeRefreshTimerFromCookie,
};
