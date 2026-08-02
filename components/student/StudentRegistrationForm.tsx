"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { CERTIFICATE_TYPES, GENDERS } from "@/components/certificates/preview-types";

interface CourseOption {
  id: string;
  title: string;
}

interface StudentRegistrationFormProps {
  courses: CourseOption[];
}

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:placeholder:text-slate-500";

interface FormState {
  name: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  photo: string;
  certificateType: string;
  courseId: string;
  technology: string;
  projectName: string;
  trainerName: string;
  duration: string;
  startDate: string;
  endDate: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  fatherName: "",
  motherName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  photo: "",
  certificateType: "training",
  courseId: "",
  technology: "",
  projectName: "",
  trainerName: "",
  duration: "",
  startDate: "",
  endDate: "",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export default function StudentRegistrationForm({ courses }: StudentRegistrationFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    courseId: courses[0]?.id ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim() || !/^\+?[0-9][0-9\s\-()]{7,17}$/.test(form.phone.trim())) {
      next.phone = "Please enter a valid mobile number.";
    }
    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode.trim())) {
      next.pincode = "Pincode must be a valid 6-digit code.";
    }
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      if (Number.isNaN(dob.getTime())) next.dateOfBirth = "Please enter a valid date of birth.";
      else if (dob.getTime() > Date.now()) next.dateOfBirth = "Date of birth cannot be in the future.";
    }
    if (!form.courseId) next.courseId = "Please select a course.";
    if (!form.duration.trim()) next.duration = "Duration is required.";
    if (!form.startDate) next.startDate = "Start date is required.";
    if (!form.endDate) {
      next.endDate = "End date is required.";
    } else if (form.startDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) next.endDate = "End date cannot be before the start date.";
    }
    return next;
  }

  function handlePhoto(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be a PNG, JPG or WebP image." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const MAX = 600;
        const scale = Math.min(1, MAX / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        set("photo", canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError("");
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        certificate?: { referenceNo: string };
      };

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          setServerError(result.error ?? "Registration failed. Please try again.");
        }
        return;
      }

      if (result.certificate?.referenceNo) {
        router.push(`/student/success?ref=${encodeURIComponent(result.certificate.referenceNo)}`);
      } else {
        router.push("/student/success");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const photoPreview = useMemo(() => form.photo, [form.photo]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {serverError ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <Section title="Personal Details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name" error={errors.name} required>
            <input
              className={inputClasses}
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
          </Field>
          <Field label="Father's Name" error={errors.fatherName}>
            <input
              className={inputClasses}
              value={form.fatherName}
              onChange={(event) => set("fatherName", event.target.value)}
              placeholder="e.g. Ramesh Sharma"
            />
          </Field>
          <Field label="Mother's Name" error={errors.motherName}>
            <input
              className={inputClasses}
              value={form.motherName}
              onChange={(event) => set("motherName", event.target.value)}
              placeholder="e.g. Sunita Sharma"
            />
          </Field>
          <Field label="Gender" error={errors.gender}>
            <select
              className={inputClasses}
              value={form.gender}
              onChange={(event) => set("gender", event.target.value)}
            >
              <option value="">Select gender</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {GENDER_LABELS[gender] ?? gender}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              className={inputClasses}
              value={form.dateOfBirth}
              onChange={(event) => set("dateOfBirth", event.target.value)}
            />
          </Field>
          <Field label="Mobile Number" error={errors.phone} required>
            <input
              className={inputClasses}
              value={form.phone}
              onChange={(event) => set("phone", event.target.value)}
              placeholder="e.g. +91 98765 43210"
              inputMode="tel"
            />
          </Field>
          <Field label="Email" error={errors.email} required>
            <input
              type="email"
              className={inputClasses}
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              placeholder="e.g. rahul@example.com"
            />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <input
              className={inputClasses}
              value={form.pincode}
              onChange={(event) => set("pincode", event.target.value)}
              placeholder="e.g. 400001"
              inputMode="numeric"
              maxLength={6}
            />
          </Field>
          <Field label="Address" error={errors.address} className="sm:col-span-2">
            <textarea
              className={cn(inputClasses, "min-h-[88px] resize-y")}
              value={form.address}
              onChange={(event) => set("address", event.target.value)}
              placeholder="Street, locality, landmark..."
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              className={inputClasses}
              value={form.city}
              onChange={(event) => set("city", event.target.value)}
              placeholder="e.g. Lucknow"
            />
          </Field>
          <Field label="State" error={errors.state}>
            <input
              className={inputClasses}
              value={form.state}
              onChange={(event) => set("state", event.target.value)}
              placeholder="e.g. Uttar Pradesh"
            />
          </Field>
        </div>
      </Section>

      <Section title="Training Details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Certificate Type" error={errors.certificateType} required>
            <select
              className={inputClasses}
              value={form.certificateType}
              onChange={(event) => set("certificateType", event.target.value)}
            >
              {CERTIFICATE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Course" error={errors.courseId} required>
            <select
              className={inputClasses}
              value={form.courseId}
              onChange={(event) => set("courseId", event.target.value)}
            >
              {courses.length === 0 ? (
                <option value="">No courses available right now</option>
              ) : null}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Technology" error={errors.technology}>
            <input
              className={inputClasses}
              value={form.technology}
              onChange={(event) => set("technology", event.target.value)}
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </Field>
          <Field label="Project Name" error={errors.projectName}>
            <input
              className={inputClasses}
              value={form.projectName}
              onChange={(event) => set("projectName", event.target.value)}
              placeholder="e.g. E-commerce Platform"
            />
          </Field>
          <Field label="Trainer Name" error={errors.trainerName}>
            <input
              className={inputClasses}
              value={form.trainerName}
              onChange={(event) => set("trainerName", event.target.value)}
              placeholder="Name of your trainer"
            />
          </Field>
          <Field label="Duration" error={errors.duration} required>
            <input
              className={inputClasses}
              value={form.duration}
              onChange={(event) => set("duration", event.target.value)}
              placeholder="e.g. 6 Weeks"
            />
          </Field>
          <Field label="Start Date" error={errors.startDate} required>
            <input
              type="date"
              className={inputClasses}
              value={form.startDate}
              onChange={(event) => set("startDate", event.target.value)}
            />
          </Field>
          <Field label="End Date" error={errors.endDate} required>
            <input
              type="date"
              className={inputClasses}
              value={form.endDate}
              onChange={(event) => set("endDate", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Uploads">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student photo preview"
                className="size-28 rounded-xl border border-slate-200 object-cover dark:border-navy-700"
              />
            ) : (
              <div className="flex size-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-navy-700 dark:bg-navy-800/50">
                <Camera className="size-7 text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Field label="Student Photo" error={errors.photo} hint="PNG, JPG or WebP. Optional.">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-3 file:cursor-pointer file:border-0 file:bg-tech-500/15 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-tech-700 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-200 dark:file:bg-tech-500/15 dark:file:text-tech-400"
                onChange={(event) => handlePhoto(event.target.files?.[0])}
              />
            </Field>
          </div>
        </div>
      </Section>

      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || courses.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-tech-500 px-8 py-3.5 text-sm font-bold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {submitting ? "Registering..." : "Submit Registration"}
        </button>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          By registering, you agree that your details will be stored to issue and verify your
          certificate. A unique Reference Number will be generated automatically.
        </p>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
      <h2 className="mb-5 text-base font-bold text-navy-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  );
}
