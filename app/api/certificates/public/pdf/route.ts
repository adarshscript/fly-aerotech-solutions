import { NextResponse, type NextRequest } from "next/server";
import { generateCertificatePdfByReference } from "@/services/certificate.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("ref")?.trim() ?? "";

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "A reference number is required." },
      { status: 400 }
    );
  }

  try {
    const pdf = await generateCertificatePdfByReference(reference);
    if (!pdf) {
      return NextResponse.json(
        { success: false, error: "Certificate not found or is no longer valid." },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(pdf.data), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdf.fileName}"`,
        "Content-Length": String(pdf.sizeBytes),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not generate PDF." },
      { status: 500 }
    );
  }
}
