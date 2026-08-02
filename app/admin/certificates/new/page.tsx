import type { Metadata } from "next";
import CertificateForm, {
  type CourseOption,
  type StudentOption,
} from "@/components/admin/certificates/CertificateForm";
import { getCertificateCompanyView } from "@/services/certificate.service";
import { getAllCourses } from "@/services/course.service";
import { listStudents } from "@/services/student.service";

export const metadata: Metadata = {
  title: "Issue Certificate",
  description: "Issue a new training, internship or experience certificate.",
};

export default async function NewCertificatePage() {
  const [company, students, courses] = await Promise.all([
    getCertificateCompanyView(),
    listStudents(),
    getAllCourses(),
  ]);

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
        mode="create"
        students={studentOptions}
        courses={courseOptions}
        company={company}
      />
    </div>
  );
}
