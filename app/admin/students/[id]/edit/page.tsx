import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudentForm, {
  type CourseOption,
  type StudentFormInitial,
} from "@/components/admin/students/StudentForm";
import { getStudentAdminViewById } from "@/services/student.service";
import { getAllCourses } from "@/services/course.service";

export const metadata: Metadata = {
  title: "Edit Student",
  description: "Update a student's personal and training details.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditStudentPage({ params }: PageProps) {
  const { id } = await params;
  const [student, courses] = await Promise.all([getStudentAdminViewById(id), getAllCourses()]);
  if (!student) notFound();

  const initialData: StudentFormInitial = {
    name: student.name,
    fatherName: student.fatherName ?? "",
    motherName: student.motherName ?? "",
    gender: student.gender ?? "",
    dateOfBirth: toDateInputValue(student.dateOfBirth),
    email: student.email,
    phone: student.phone,
    address: student.address ?? "",
    city: student.city ?? "",
    state: student.state ?? "",
    pincode: student.pincode ?? "",
    photo: student.photo ?? "",
    courseId: student.courseId,
    status: student.status,
  };

  const courseOptions: CourseOption[] = courses.map((course) => ({
    id: String((course as unknown as { _id: unknown })._id),
    title: course.title,
  }));

  return (
    <div>
      <StudentForm mode="edit" studentId={student.id} courses={courseOptions} initialData={initialData} />
    </div>
  );
}
