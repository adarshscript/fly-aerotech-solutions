"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { GENDERS, STUDENT_STATUSES } from "@/components/certificates/preview-types";
import PhotoUploader from "@/components/ui/PhotoUploader";

export interface CourseOption {
  id: string;
  title: string;
}

export interface StudentFormInitial {
  name: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  photo: string;
  courseId: string;
  status: string;
}

interface StudentFormProps {
  mode: "create" | "edit";
  courses: CourseOption[];
  studentId?: string;
  initialData?: StudentFormInitial;
}

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
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
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
      <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function StudentForm({ mode, courses, studentId, initialData }: StudentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [fatherName, setFatherName] = useState(initialData?.fatherName ?? "");
  const [motherName, setMotherName] = useState(initialData?.motherName ?? "");
  const [gender, setGender] = useState(initialData?.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [state, setState] = useState(initialData?.state ?? "");
  const [pincode, setPincode] = useState(initialData?.pincode ?? "");
  const [photo, setPhoto] = useState(initialData?.photo ?? "");
  const [courseId, setCourseId] = useState(initialData?.courseId ?? courses[0]?.id ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaving(true);

    const payload = {
      name,
      fatherName,
      motherName,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`).toISOString() : undefined,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      photo: photo || undefined,
      course: courseId,
      status,
    };

    try {
      const response = await fetch(mode === "create" ? "/api/students" : `/api/students/${studentId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        student?: { id?: string };
      };
      if (!response.ok || !result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setError(result.error ?? "Could not save the student. Check the highlighted fields.");
        return;
      }
      const id = result.student?.id ?? studentId;
      router.push(`/admin/students/${id}`);
      router.refresh();
    } catch {
      setError("Network error while saving the student.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={mode === "edit" && studentId ? `/admin/students/${studentId}` : "/admin/students"}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-tech-600 dark:text-slate-400"
          >
            <ArrowLeft className="size-4" />
            {mode === "edit" ? "Back to student" : "Back to students"}
          </Link>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {mode === "create" ? "New Student" : "Edit Student"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "create"
              ? "Add a student record. Certificates are issued separately."
              : "Update this student's personal and training details."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={mode === "edit" && studentId ? `/admin/students/${studentId}` : "/admin/students"}
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
            {saving ? "Saving..." : mode === "create" ? "Create Student" : "Save Changes"}
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
        <Section title="Personal Details">
          <div className="space-y-4">
            <Field label="Full Name" required error={fieldErrors.name}>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Adarsh Kumar Maurya"
                className={inputClasses}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Father's Name">
                <input value={fatherName} onChange={(event) => setFatherName(event.target.value)} className={inputClasses} />
              </Field>
              <Field label="Mother's Name">
                <input value={motherName} onChange={(event) => setMotherName(event.target.value)} className={inputClasses} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Gender">
                <select value={gender} onChange={(event) => setGender(event.target.value)} className={inputClasses}>
                  <option value="">Select...</option>
                  {GENDERS.map((value) => (
                    <option key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className={inputClasses}
                />
              </Field>
            </div>
            <PhotoUploader value={photo} onChange={setPhoto} label="Photo (optional)" />
          </div>
        </Section>

        <Section title="Contact & Address">
          <div className="space-y-4">
            <Field label="Email Address" required error={fieldErrors.email}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                className={inputClasses}
              />
            </Field>
            <Field label="Mobile Number" required error={fieldErrors.phone}>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={inputClasses}
              />
            </Field>
            <Field label="Address">
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={2}
                className={inputClasses}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="City">
                <input value={city} onChange={(event) => setCity(event.target.value)} className={inputClasses} />
              </Field>
              <Field label="State">
                <input value={state} onChange={(event) => setState(event.target.value)} className={inputClasses} />
              </Field>
            </div>
            <Field label="Pincode" error={fieldErrors.pincode}>
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                inputMode="numeric"
                placeholder="6-digit PIN code"
                className={inputClasses}
              />
            </Field>
          </div>
        </Section>
      </div>

      <Section title="Training Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Course" required error={fieldErrors.course}>
            <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className={inputClasses}>
              {courses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              )}
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClasses}>
              {STUDENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>
    </form>
  );
}
