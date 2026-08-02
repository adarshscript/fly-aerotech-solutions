import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Student Portal",
  description:
    "Fly Aerotech Solutions student portal — enrollments, certificates and progress tracking coming in a future phase.",
};

export default function StudentPage() {
  return (
    <EmptyState
      icon={GraduationCap}
      title="Student Portal"
      description="Soon, students will be able to access their enrollments, training progress and certificates here in one place."
    />
  );
}
