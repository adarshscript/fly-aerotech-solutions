import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CertificateForm, {
  type CourseOption,
  type StudentOption,
} from "@/components/admin/certificates/CertificateForm";
import {
  getCertificateCompanyView,
  getCertificateViewById,
} from "@/services/certificate.service";
import { getAllCourses } from "@/services/course.service";
import { listStudents } from "@/services/student.service";

export const metadata: Metadata = {
  title: "Edit Certificate",
  description: "Edit certificate details with live preview.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificatePage({ params }: PageProps) {
  const { id } = await params;
  const [certificate, company, students, courses] = await Promise.all([
    getCertificateViewById(id),
    getCertificateCompanyView(),
    listStudents(),
    getAllCourses(),
  ]);

  if (!certificate) notFound();

  const studentOptions: StudentOption[] = students.map((student) => ({
    id: String((student as unknown as { _id: unknown })._id),
    name: student.name,
    fatherName: student.fatherName,
  }));

  const courseOptions: CourseOption[] = courses.map((course) => ({
    id: String((course as unknown as { _id: unknown })._id),
    title: course.title,
  }));

  return (
    <div className="space-y-6">
      <CertificateForm
        mode="edit"
        students={studentOptions}
        courses={courseOptions}
        company={company}
        initialData={certificate}
      />
    </div>
  );
}
