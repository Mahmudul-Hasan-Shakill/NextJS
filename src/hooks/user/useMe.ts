"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decrypt } from "@/services/secretService";
import { userService } from "@/services/userServices";

export type Me = {
  id: number;
  pin: string;
  role: string; // e.g. "root", "CS - Admin"
  unit?: string; // e.g. "CS", "NET"
  [k: string]: any;
} | null;

export function useMe() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const encPin = Cookies.get("USRPIN");
        if (!encPin) {
          setMe(null);
          return;
        }
        const pin = decrypt(encPin);
        const res = await userService.getUserByPin(pin);
        setMe(res?.data ?? null);
      } catch (e: any) {
        setErr(e?.message || "Failed to load current user");
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { me, loading, error };
}
