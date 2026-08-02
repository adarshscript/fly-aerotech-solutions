import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/services/auth/auth.service";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, admin: null }, { status: 401 });
  }
  return NextResponse.json({ success: true, admin });
}
