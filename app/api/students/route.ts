import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  createStudent,
  listStudentsAdmin,
} from "@/services/student.service";
import { isValidEmail, isValidPhone } from "@/lib/validators";
import { Course } from "@/models";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const result = await listStudentsAdmin({
      search: searchParams.get("search")?.trim() || undefined,
      status: searchParams.get("status")?.trim() || undefined,
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 10),
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not list students." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const fieldErrors: Record<string, string> = {};
    if (!body.name || String(body.name).trim().length < 2) fieldErrors.name = "Name is required.";
    if (!body.email) fieldErrors.email = "Email is required.";
    else if (!isValidEmail(String(body.email))) fieldErrors.email = "Invalid email address.";
    if (!body.phone) fieldErrors.phone = "Mobile number is required.";
    else if (!isValidPhone(String(body.phone))) fieldErrors.phone = "Invalid mobile number.";
    if (!body.course) fieldErrors.course = "Course is required.";
    if (body.pincode && !/^[0-9]{6}$/.test(String(body.pincode).trim())) {
      fieldErrors.pincode = "Pincode must be a valid 6-digit code.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ success: false, fieldErrors }, { status: 400 });
    }

    const course = await Course.findById(String(body.course)).lean();
    if (!course) {
      return NextResponse.json(
        { success: false, fieldErrors: { course: "Selected course does not exist." } },
        { status: 400 }
      );
    }

    const student = await createStudent({
      name: String(body.name).trim(),
      fatherName: typeof body.fatherName === "string" ? body.fatherName.trim() : undefined,
      motherName: typeof body.motherName === "string" ? body.motherName.trim() : undefined,
      gender: body.gender as "male" | "female" | "other" | undefined,
      dateOfBirth: body.dateOfBirth ? new Date(String(body.dateOfBirth)) : undefined,
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone).trim(),
      address: typeof body.address === "string" ? body.address.trim() : undefined,
      city: typeof body.city === "string" ? body.city.trim() : undefined,
      state: typeof body.state === "string" ? body.state.trim() : undefined,
      pincode: typeof body.pincode === "string" ? body.pincode.trim() : undefined,
      photo: typeof body.photo === "string" ? body.photo : undefined,
      course: String(body.course),
      status: body.status as "active" | "completed" | "dropped" | "pending",
    } as unknown as Parameters<typeof createStudent>[0]);

    return NextResponse.json(
      {
        success: true,
        student: {
          id: String((student as unknown as { _id: unknown })._id),
          referenceNo: student.referenceNo,
          name: student.name,
          email: student.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not create student." },
      { status: 500 }
    );
  }
}
