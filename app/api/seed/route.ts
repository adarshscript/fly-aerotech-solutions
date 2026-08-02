import { NextResponse } from "next/server";
import { runSeed } from "@/lib/seed";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Seed route is disabled in production" },
      { status: 403 }
    );
  }

  try {
    const report = await runSeed();
    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
