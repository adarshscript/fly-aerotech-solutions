"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["web", "software", "programming", "data", "cloud", "research"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web Development",
  software: "Software Development",
  programming: "Programming",
  data: "Data & Analytics",
  cloud: "Cloud Computing",
  research: "Research",
};

interface CourseFormProps {
  mode: "create" | "edit";
  courseId?: string;
  initialData?: {
    title: string;
    slug: string;
    description: string;
    duration: string;
    category: string;
    fee: number;
    curriculum: string[];
    isActive: boolean;
  };
}

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

function Field({
  label,
  required,
  hint,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function CourseForm({ mode, courseId, initialData }: CourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [duration, setDuration] = useState(initialData?.duration ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [fee, setFee] = useState(initialData?.fee ?? 0);
  const [curriculumText, setCurriculumText] = useState(initialData?.curriculum.join("\n") ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaving(true);

    const payload = {
      title,
      slug: slug || undefined,
      description,
      duration,
      category,
      fee,
      curriculum: curriculumText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      isActive,
    };

    try {
      const response = await fetch(mode === "create" ? "/api/courses" : `/api/courses/${courseId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        course?: { id?: string };
      };
      if (!response.ok || !result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setError(result.error ?? "Could not save the course. Check the highlighted fields.");
        return;
      }
      router.push("/admin/courses");
      router.refresh();
    } catch {
      setError("Network error while saving the course.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/courses"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-tech-600 dark:text-slate-400"
          >
            <ArrowLeft className="size-4" />
            Back to courses
          </Link>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {mode === "create" ? "New Course" : "Edit Course"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "create"
              ? "Add a course students can register for and receive certificates against."
              : "Update this course's details."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : mode === "create" ? "Create Course" : "Save Changes"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-white">Basics</h2>
          <div className="space-y-4">
            <Field label="Course Title" required error={fieldErrors.title}>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className={inputClasses}
              />
            </Field>
            <Field label="Slug" hint="Used in the public URL. Leave empty to auto-generate from the title." error={fieldErrors.slug}>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="full-stack-web-development"
                className={cn(inputClasses, "font-mono")}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Duration" required error={fieldErrors.duration}>
                <input
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g. 6 months"
                  className={inputClasses}
                />
              </Field>
              <Field label="Category" required error={fieldErrors.category}>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClasses}>
                  <option value="">Select...</option>
                  {CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {CATEGORY_LABELS[value]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Fee (₹)" hint="Set to 0 for a free course." error={fieldErrors.fee}>
              <input
                type="number"
                min={0}
                value={fee}
                onChange={(event) => setFee(Number(event.target.value))}
                className={inputClasses}
              />
            </Field>
            <Field label="Description" required hint="At least 20 characters." error={fieldErrors.description}>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className={inputClasses}
              />
            </Field>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="size-4 accent-[#00a0e9]"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Course is active and visible to students
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-white">Curriculum</h2>
          <Field
            label="Topics"
            hint="One topic per line, up to 20. Shown on the public course page."
          >
            <textarea
              value={curriculumText}
              onChange={(event) => setCurriculumText(event.target.value)}
              rows={16}
              placeholder={"HTML, CSS & JavaScript\nReact & Next.js\nNode.js & MongoDB"}
              className={cn(inputClasses, "font-mono text-xs leading-6")}
            />
          </Field>
        </section>
      </div>
    </form>
  );
}
