import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/courses/CourseForm";
import { getCourseById } from "@/services/course.service";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Update a training course.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  return (
    <div>
      <CourseForm
        mode="edit"
        courseId={id}
        initialData={{
          title: course.title,
          slug: course.slug,
          description: course.description,
          duration: course.duration,
          category: course.category,
          fee: course.fee,
          curriculum: course.curriculum,
          isActive: course.isActive,
        }}
      />
    </div>
  );
}
