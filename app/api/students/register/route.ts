import { NextResponse, type NextRequest } from "next/server";
import {
  registerStudent,
  type StudentRegistrationInput,
} from "@/services/registration.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<StudentRegistrationInput>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const result = await registerStudent(body as StudentRegistrationInput);
    if (!result.ok) {
      return NextResponse.json({ success: false, ...result }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, student: result.student, certificate: result.certificate },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Registration failed." },
      { status: 500 }
    );
  }
}
