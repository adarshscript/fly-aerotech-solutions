import type { Metadata } from "next";
import CourseForm from "@/components/admin/courses/CourseForm";

export const metadata: Metadata = {
  title: "New Course",
  description: "Add a new training course.",
};

export default function NewCoursePage() {
  return (
    <div>
      <CourseForm mode="create" />
    </div>
  );
}
