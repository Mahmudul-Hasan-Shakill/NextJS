"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { decrypt } from "@/services/secretService";
import Cookies from "js-cookie";

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
}) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const encRoles = Cookies.get("USRROLE");
    const decrypted = encRoles ? decrypt(encRoles) : "";

    const roles =
      typeof decrypted === "string"
        ? decrypted.split(",").map((r) => r.trim().toLowerCase())
        : [];

    setUserRoles(roles);
  }, []);

  const allowed = allowedRoles.map((r) => r.toLowerCase());
  const hasAccess = allowed.some((role) => userRoles.includes(role));

  return hasAccess ? <>{children}</> : null;
};

export default RoleBasedAccess;
