import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json(
      { success: true, message: "MongoDB Connected Successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    console.error("[api/test-db]", message);
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB Connection Failed",
        error: message,
      },
      { status: 500 }
    );
  }
}
