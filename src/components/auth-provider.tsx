// // components/auth-provider.tsx
// "use client";

// import { useEffect } from "react";
// import { authService } from "@/services/authServices";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     authService.resumeRefreshTimerFromCookie();
//   }, []);

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authService, setSessionExpiredHandler } from "@/services/authServices";
import SessionExpiredDialog from "./auth/sessionExpiration";
import Cookies from "js-cookie";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionExpired, setSessionExpired] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isLoginPage = pathname === "/";

    if (isLoginPage) {
      setSessionExpired(false);
    }

    const hasPinCookie = !!Cookies.get("USRPIN");
    const hasTokenExpiry = !!Cookies.get("TKNEXP");

    if (!isLoginPage && hasPinCookie && hasTokenExpiry) {
      authService.resumeRefreshTimerFromCookie({
        onSessionExpired: () => {
          setSessionExpired(true);
        },
      });
    }

    setSessionExpiredHandler(() => {
      setSessionExpired(true);
    });
  }, [pathname]);

  return (
    <>
      {children}
      {sessionExpired && pathname !== "/" && <SessionExpiredDialog />}
    </>
  );
}
