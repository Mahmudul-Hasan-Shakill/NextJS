// services/cookieClient.ts
import Cookies from "js-cookie";

type SameSite = "lax" | "strict" | "none";

// Minimal cookie attrs you actually use
type CookieOpts = {
  path?: string;
  domain?: string;
  expires?: number | Date;
  secure?: boolean;
  sameSite?: SameSite;
};

const sameSite = (
  process.env.NEXT_PUBLIC_COOKIE_SAMESITE || "lax"
).toLowerCase() as SameSite;
const secureEnv =
  String(process.env.NEXT_PUBLIC_COOKIE_SECURE || "false").toLowerCase() ===
  "true";
const domainEnv = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
const defaultSecure = sameSite === "none" ? true : secureEnv;

const baseAttrs: CookieOpts = {
  path: "/",
  sameSite,
  secure: defaultSecure,
  ...(domainEnv ? { domain: domainEnv } : {}),
};

export function setClientCookie(
  name: string,
  value: string,
  attrs?: CookieOpts
) {
  Cookies.set(name, value, { ...baseAttrs, ...attrs } as any);
}

export function removeClientCookie(name: string) {
  Cookies.remove(name, {
    path: "/",
    ...(domainEnv ? { domain: domainEnv } : {}),
  } as any);
}
