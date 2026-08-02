import { connectToDatabase } from "@/lib/mongodb";
import { Course, type ICourse } from "@/models";

type CourseInput = Omit<ICourse, "createdAt" | "updatedAt">;
type CourseUpdate = Partial<CourseInput>;

export async function listActiveCourses(): Promise<ICourse[]> {
  await connectToDatabase();
  return Course.find({ isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function getAllCourses(): Promise<ICourse[]> {
  await connectToDatabase();
  return Course.find().sort({ createdAt: -1 }).lean();
}

export async function getCourseBySlug(slug: string): Promise<ICourse | null> {
  await connectToDatabase();
  return Course.findOne({ slug, isActive: true }).lean();
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  await connectToDatabase();
  return Course.findById(id).lean();
}

export async function createCourse(data: CourseInput): Promise<ICourse> {
  await connectToDatabase();
  return Course.create(data);
}

export async function updateCourse(id: string, data: CourseUpdate): Promise<ICourse | null> {
  await connectToDatabase();
  return Course.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteCourse(id: string): Promise<ICourse | null> {
  await connectToDatabase();
  return Course.findByIdAndDelete(id).lean();
}
