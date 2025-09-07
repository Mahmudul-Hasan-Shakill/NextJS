// src/components/dashboard/home/home.data.ts
"use client";

import { useMemo } from "react";
import { useAllUsers } from "@/hooks/user/useAllUsers";

export function useHomeData() {
  const { users } = useAllUsers();

  const kpis = useMemo(() => {
    const total = users.length;

    let inactive = 0;
    let loggedIn = 0;
    let locked = 0;
    let reset = 0;

    users.forEach((u: any) => {
      if (u?.isActive === false) inactive += 1;
      if (u?.isLogin === true) loggedIn += 1;
      if (u?.isLocked === true) locked += 1;
      if (u?.isReset === true) reset += 1;
    });

    return { total, inactive, loggedIn, locked, reset };
  }, [users]);

  return { kpis };
}
