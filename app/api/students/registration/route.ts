import { NextResponse, type NextRequest } from "next/server";
import { getRegistrationByReference } from "@/services/registration.service";

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
    const registration = await getRegistrationByReference(reference);
    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, ...registration });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not load registration." },
      { status: 500 }
    );
  }
}
