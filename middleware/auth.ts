import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "admin_session";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

function getSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function verifyRequestSession(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "fly-aerotech-admin",
    });
    if (!payload.sub || typeof payload.role !== "string") return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function redirectToLogin(request: NextRequest): NextResponse {
  const url = new URL("/admin-login", request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== "/admin") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export function redirectToDashboard(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL("/admin/dashboard", request.url));
}
