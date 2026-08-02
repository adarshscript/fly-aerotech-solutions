import type { Metadata } from "next";
import StudentsManager from "@/components/admin/students/StudentsManager";

export const metadata: Metadata = {
  title: "Students",
  description: "Manage registered students, search, filter and edit their records.",
};

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6">
      <StudentsManager />
    </div>
  );
}
