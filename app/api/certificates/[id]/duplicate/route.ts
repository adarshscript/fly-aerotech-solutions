import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { duplicateCertificate } from "@/services/certificate.service";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const certificate = await duplicateCertificate(id);
    if (!certificate) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not duplicate certificate." },
      { status: 500 }
    );
  }
}
