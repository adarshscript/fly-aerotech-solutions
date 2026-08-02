import { NextResponse, type NextRequest } from "next/server";
import { verifyRequestSession, type SessionPayload } from "@/middleware/auth";

export type AdminApiResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse };

export async function requireAdmin(request: NextRequest): Promise<AdminApiResult> {
  const session = await verifyRequestSession(request);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
