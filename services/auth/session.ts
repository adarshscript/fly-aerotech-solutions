import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isAdminRole, type AdminRole } from "@/services/auth/roles";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;
  if (!secret) {
    console.error(
      "[auth] AUTH_SECRET is not defined. " +
        "On Vercel, add AUTH_SECRET to Project Settings > Environment Variables (Production environment)."
    );
    throw new Error(
      "AUTH_SECRET is not defined. On Vercel, add AUTH_SECRET to Project Settings > Environment Variables (Production environment)."
    );
  }
  return new TextEncoder().encode(secret);
}

function toPayload(data: {
  sub: string;
  email: string;
  name: string;
  role: string;
}): SessionPayload | null {
  if (!isAdminRole(data.role)) return null;
  return { sub: data.sub, email: data.email, name: data.name, role: data.role };
}

export async function signSession(data: {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}): Promise<string> {
  return new SignJWT({ email: data.email, name: data.name, role: data.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(data.sub)
    .setIssuedAt()
    .setIssuer("fly-aerotech-admin")
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
      issuer: "fly-aerotech-admin",
    });
    return toPayload({
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: String(payload.role ?? ""),
    });
  } catch {
    return null;
  }
}

export async function createSessionCookie(data: {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}): Promise<void> {
  const token = await signSession(data);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
