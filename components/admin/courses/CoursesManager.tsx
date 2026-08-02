"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit3, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  category: string;
  fee: number;
  curriculum: string[];
  isActive: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web Development",
  software: "Software Development",
  programming: "Programming",
  data: "Data & Analytics",
  cloud: "Cloud Computing",
  research: "Research",
};

function formatFee(fee: number): string {
  return fee > 0 ? `₹${fee.toLocaleString("en-IN")}` : "Free";
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/courses");
        const result = (await response.json()) as { success: boolean; courses?: CourseRow[]; error?: string };
        if (cancelled) return;
        if (!response.ok || !result.success) {
          setError(result.error ?? "Could not load courses.");
          return;
        }
        setCourses(result.courses ?? []);
      } catch {
        if (!cancelled) setError("Network error while loading courses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete course "${title}"? Students linked to it will need re-assignment.`)) return;
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Could not delete course.");
        return;
      }
      setLoading(true);
      setReloadKey((prev) => prev + 1);
    } catch {
      setError("Network error while deleting course.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Courses</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {courses.length} course{courses.length === 1 ? "" : "s"} offered by the academy
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
        >
          <Plus className="size-4" />
          New Course
        </Link>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No courses yet. Create your first course to enable student registration.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-navy-800/50"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="font-semibold text-navy-900 hover:text-tech-600 dark:text-white dark:hover:text-tech-400"
                    >
                      {course.title}
                    </Link>
                    <span className="rounded-full bg-slate-500/15 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {CATEGORY_LABELS[course.category] ?? course.category}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        course.isActive
                          ? "bg-tech-500/15 text-tech-600 dark:text-tech-400"
                          : "bg-slate-500/15 text-slate-500"
                      )}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                    {course.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {course.duration} · {formatFee(course.fee)} · {course.curriculum.length} curriculum topic
                    {course.curriculum.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    title="Edit"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-tech-500/10 hover:text-tech-600 dark:hover:text-tech-400"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    title="Delete"
                    disabled={deletingId === course.id}
                    onClick={() => handleDelete(course.id, course.title)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                  >
                    {deletingId === course.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Edit3 className="size-3.5" />
        Courses shown on the public site are controlled by their Active status and site settings.
      </p>
    </div>
  );
}
