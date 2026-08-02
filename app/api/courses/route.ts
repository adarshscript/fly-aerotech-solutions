import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  createCourse,
  getAllCourses,
} from "@/services/course.service";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const courses = await getAllCourses();
    return NextResponse.json({
      success: true,
      courses: courses.map((course) => ({
        id: String((course as unknown as { _id: unknown })._id),
        title: course.title,
        slug: course.slug,
        description: course.description,
        duration: course.duration,
        category: course.category,
        fee: course.fee,
        curriculum: course.curriculum,
        isActive: course.isActive,
        createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : "",
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not list courses." },
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
    if (!body.title || String(body.title).trim().length < 3) {
      fieldErrors.title = "Title must be at least 3 characters.";
    }
    if (!body.description || String(body.description).trim().length < 20) {
      fieldErrors.description = "Description must be at least 20 characters.";
    }
    if (!body.duration) fieldErrors.duration = "Duration is required.";
    if (!body.category) fieldErrors.category = "Category is required.";
    if (typeof body.fee === "number" && body.fee < 0) fieldErrors.fee = "Fee cannot be negative.";

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ success: false, fieldErrors }, { status: 400 });
    }

    const course = await createCourse({
      title: String(body.title).trim(),
      slug: typeof body.slug === "string" ? String(body.slug).trim() : "",
      description: String(body.description).trim(),
      duration: String(body.duration).trim(),
      category: body.category as "web" | "software" | "programming" | "data" | "cloud" | "research",
      fee: typeof body.fee === "number" ? body.fee : 0,
      curriculum: Array.isArray(body.curriculum)
        ? (body.curriculum as unknown[]).map(String).filter(Boolean)
        : [],
      isActive: typeof body.isActive === "boolean" ? body.isActive : true,
      coverImage: typeof body.coverImage === "string" ? body.coverImage : undefined,
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Could not create course." },
      { status: 500 }
    );
  }
}
