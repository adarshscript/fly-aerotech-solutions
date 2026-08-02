import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  deleteCertificate,
  getCertificateViewById,
  updateCertificate,
} from "@/services/certificate.service";

interface RouteParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const certificate = await getCertificateViewById(id);
    if (!certificate) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not load certificate." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const certificate = await updateCertificate(id, {
      fatherName: typeof body.fatherName === "string" ? body.fatherName : undefined,
      technology: typeof body.technology === "string" ? body.technology : undefined,
      projectName: typeof body.projectName === "string" ? body.projectName : undefined,
      trainerName: typeof body.trainerName === "string" ? body.trainerName : undefined,
      type: body.type as "training" | "internship" | "experience" | "appreciation",
      issueDate: body.issueDate ? new Date(String(body.issueDate)) : undefined,
      startDate: body.startDate ? new Date(String(body.startDate)) : undefined,
      endDate: body.endDate ? new Date(String(body.endDate)) : undefined,
      expiryDate: body.expiryDate ? new Date(String(body.expiryDate)) : undefined,
      duration: typeof body.duration === "string" ? body.duration : undefined,
      template: body.template as "classic" | "modern" | "minimal",
      status: body.status as "draft" | "issued" | "revoked" | "duplicate",
      logo: typeof body.logo === "string" ? body.logo : undefined,
      authorizedSignature: body.authorizedSignature as CertificateUpdate["authorizedSignature"],
      officialStamp: body.officialStamp as CertificateUpdate["officialStamp"],
    });

    if (!certificate) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not update certificate." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await deleteCertificate(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, certificate: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not delete certificate." },
      { status: 500 }
    );
  }
}

type CertificateUpdate = Parameters<typeof updateCertificate>[1];
