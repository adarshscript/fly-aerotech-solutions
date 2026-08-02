import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { deleteCourse, updateCourse } from "@/services/course.service";

interface RouteParams {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const course = await updateCourse(id, {
      title: typeof body.title === "string" ? body.title.trim() : undefined,
      description: typeof body.description === "string" ? body.description.trim() : undefined,
      duration: typeof body.duration === "string" ? body.duration.trim() : undefined,
      category: body.category as "web" | "software" | "programming" | "data" | "cloud" | "research",
      fee: typeof body.fee === "number" ? body.fee : undefined,
      curriculum: Array.isArray(body.curriculum)
        ? (body.curriculum as unknown[]).map(String).filter(Boolean)
        : undefined,
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      coverImage: typeof body.coverImage === "string" ? body.coverImage : undefined,
    });

    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not update course." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await deleteCourse(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, course: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not delete course." },
      { status: 500 }
    );
  }
}
