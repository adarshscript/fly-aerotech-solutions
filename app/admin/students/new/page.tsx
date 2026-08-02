import type { Metadata } from "next";
import StudentForm, { type CourseOption } from "@/components/admin/students/StudentForm";
import { getAllCourses } from "@/services/course.service";

export const metadata: Metadata = {
  title: "New Student",
  description: "Add a new student record.",
};

export default async function NewStudentPage() {
  const courses = await getAllCourses();
  const courseOptions: CourseOption[] = courses.map((course) => ({
    id: String((course as unknown as { _id: unknown })._id),
    title: course.title,
  }));

  return (
    <div>
      <StudentForm mode="create" courses={courseOptions} />
    </div>
  );
}
