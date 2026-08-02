import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  deleteStudent,
  getStudentAdminViewById,
  updateStudent,
} from "@/services/student.service";
import { isValidEmail, isValidPhone } from "@/lib/validators";

interface RouteParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const student = await getStudentAdminViewById(id);
    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, student });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not load student." },
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

    if (body.email && !isValidEmail(String(body.email))) {
      return NextResponse.json(
        { success: false, fieldErrors: { email: "Invalid email address." } },
        { status: 400 }
      );
    }
    if (body.phone && !isValidPhone(String(body.phone))) {
      return NextResponse.json(
        { success: false, fieldErrors: { phone: "Invalid mobile number." } },
        { status: 400 }
      );
    }
    if (body.pincode && !/^[0-9]{6}$/.test(String(body.pincode).trim())) {
      return NextResponse.json(
        { success: false, fieldErrors: { pincode: "Pincode must be a valid 6-digit code." } },
        { status: 400 }
      );
    }

    const student = await updateStudent(id, {
      name: typeof body.name === "string" ? body.name.trim() : undefined,
      fatherName: typeof body.fatherName === "string" ? body.fatherName.trim() : undefined,
      motherName: typeof body.motherName === "string" ? body.motherName.trim() : undefined,
      gender: body.gender as "male" | "female" | "other" | undefined,
      dateOfBirth: body.dateOfBirth ? new Date(String(body.dateOfBirth)) : undefined,
      email: typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined,
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      address: typeof body.address === "string" ? body.address.trim() : undefined,
      city: typeof body.city === "string" ? body.city.trim() : undefined,
      state: typeof body.state === "string" ? body.state.trim() : undefined,
      pincode: typeof body.pincode === "string" ? body.pincode.trim() : undefined,
      photo: typeof body.photo === "string" ? body.photo : undefined,
      course: typeof body.course === "string" ? body.course : undefined,
      status: body.status as "active" | "completed" | "dropped" | "pending",
    });

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, student });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not delete student." },
      { status: 500 }
    );
  }
}
