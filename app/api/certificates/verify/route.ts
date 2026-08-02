import { NextRequest, NextResponse } from "next/server";
import { verifyCertificateByReference } from "@/services/certificate.service";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("ref")?.trim() ?? "";

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "A certificate reference number is required." },
      { status: 400 }
    );
  }

  try {
    const result = await verifyCertificateByReference(reference);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Verification failed." },
      { status: 500 }
    );
  }
}
