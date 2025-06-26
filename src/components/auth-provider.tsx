// components/auth-provider.tsx
"use client";

import { useEffect } from "react";
import { authService } from "@/services/authServices";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    authService.resumeRefreshTimerFromCookie();
  }, []);

  return <>{children}</>;
}
