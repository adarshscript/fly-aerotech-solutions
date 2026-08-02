import { NextResponse } from "next/server";
import { loginAdmin } from "@/services/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const result = await loginAdmin(body.email ?? "", body.password ?? "");

    if (!result.ok || !result.admin) {
      return NextResponse.json({ success: false, error: result.error ?? "Login failed" }, { status: 401 });
    }

    return NextResponse.json({ success: true, admin: result.admin });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Login failed" },
      { status: 500 }
    );
  }
}
