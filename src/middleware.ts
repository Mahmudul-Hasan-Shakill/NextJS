import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("ACSTKN");
  const token = tokenCookie?.value?.trim();
  const isReset = request.cookies.get("RST")?.value === "true";
  const { pathname } = request.nextUrl;

  const isTokenValid = !!token;

  // Define protected routes
  const protectedRoutes = [
    "/home",
    "/admin-settings",
    "/user-profile",
    "/core-systems",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. No token → redirect to login
  if (!isTokenValid && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Token exists but reset required → redirect to change-password
  if (isTokenValid && isReset && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  // 3. Allow access to /registration and /reset-password without token
  if (pathname === "/self-registration" || pathname === "/reset-password") {
    return NextResponse.next();
  }

  // 4. Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home",
    "/admin-settings/:path*",
    "/change-password",
    "/registration",
    "/reset-password",
    "/user-profile",
    "/core-systems/:path*",
  ],
};
