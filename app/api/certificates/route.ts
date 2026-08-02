import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  createCertificate,
  listCertificates,
  type CreateCertificateInput,
} from "@/services/certificate.service";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const certificates = await listCertificates();
    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not list certificates." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Partial<CreateCertificateInput>;

    if (!body.student || !body.course || !body.duration) {
      return NextResponse.json(
        { success: false, error: "student, course and duration are required." },
        { status: 400 }
      );
    }
    if (!body.type) {
      return NextResponse.json(
        { success: false, error: "Certificate type is required (training, internship, experience or appreciation)." },
        { status: 400 }
      );
    }

    const certificate = await createCertificate({
      student: String(body.student),
      course: String(body.course),
      fatherName: body.fatherName,
      technology: body.technology,
      projectName: body.projectName,
      trainerName: body.trainerName,
      type: body.type,
      issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : new Date(),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      duration: body.duration,
      template: body.template,
      status: body.status,
      logo: body.logo,
      authorizedSignature: body.authorizedSignature,
      officialStamp: body.officialStamp,
    });

    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not create certificate." },
      { status: 500 }
    );
  }
}
