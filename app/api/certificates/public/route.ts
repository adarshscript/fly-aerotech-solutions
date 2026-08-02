import { NextResponse, type NextRequest } from "next/server";
import {
  getCertificateCompanyView,
  getPublicCertificateView,
} from "@/services/certificate.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("ref")?.trim() ?? "";

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "A reference number is required." },
      { status: 400 }
    );
  }

  try {
    const [certificate, company] = await Promise.all([
      getPublicCertificateView(reference),
      getCertificateCompanyView(),
    ]);
    if (!certificate) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, certificate, company });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not load certificate." },
      { status: 500 }
    );
  }
}
