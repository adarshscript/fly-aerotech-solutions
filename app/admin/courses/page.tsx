import type { Metadata } from "next";
import CoursesManager from "@/components/admin/courses/CoursesManager";

export const metadata: Metadata = {
  title: "Courses",
  description: "Manage training courses, categories, fees and curriculum.",
};

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <CoursesManager />
    </div>
  );
}
