"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decrypt } from "@/services/secretService";
import { useRolesData } from "@/hooks/useRolesData";

export function withRoleProtection<T extends object>(
  Component: React.ComponentType<T>
): React.FC<T> {
  return function ProtectedWrapper(props: T) {
    const router = useRouter();
    const pathname = usePathname();
    const { getRolesForHref, rolesData } = useRolesData();
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      // Wait until roles are loaded
      if (!rolesData || rolesData.length === 0) return;

      const encRoles = Cookies.get("USRROLE");
      if (!encRoles) {
        router.replace("/unauthorized");
        return;
      }

      const decrypted = decrypt(encRoles);
      const userRoles =
        typeof decrypted === "string"
          ? decrypted.split(",").map((r) => r.trim().toLowerCase())
          : [];

      const allowedRoles = getRolesForHref(pathname);
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

      if (!hasAccess) {
        router.replace("/unauthorized");
      } else {
        setAuthorized(true);
      }
    }, [pathname, router, getRolesForHref, rolesData]);

    if (authorized === null) {
      return <></>;
    }

    return <Component {...props} />;
  };
}
