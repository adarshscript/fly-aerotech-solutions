import { NextResponse, type NextRequest } from "next/server";
import {
  redirectToDashboard,
  redirectToLogin,
  verifyRequestSession,
} from "@/middleware/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await verifyRequestSession(request);

  if (pathname === "/admin-login") {
    return session ? redirectToDashboard(request) : NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) return redirectToLogin(request);
    if (pathname === "/admin") return redirectToDashboard(request);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
