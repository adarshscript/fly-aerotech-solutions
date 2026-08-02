import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { generateCertificatePdfById } from "@/services/certificate.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const pdf = await generateCertificatePdfById(id);
    if (!pdf) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(pdf.data), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${pdf.fileName}"`,
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
