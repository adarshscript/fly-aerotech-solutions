"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CertificatePreview from "@/components/certificates/CertificatePreview";
import {
  CERTIFICATE_TYPE_LABELS,
  LOGO_PLACEHOLDER,
  QR_PLACEHOLDER,
  SIGNATURE_PLACEHOLDER,
  STAMP_PLACEHOLDER,
  type CertificateCompanyPreview,
} from "@/components/certificates/preview-types";
import type { CertificateView } from "@/services/certificate.service";

export interface StudentOption {
  id: string;
  name: string;
  fatherName?: string;
}

export interface CourseOption {
  id: string;
  title: string;
}

interface CertificateFormProps {
  mode: "create" | "edit";
  students: StudentOption[];
  courses: CourseOption[];
  company: CertificateCompanyPreview;
  initialData?: CertificateView;
}

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p> : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
      <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

interface FormState {
  studentId: string;
  courseId: string;
  fatherName: string;
  technology: string;
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  expiryDate: string;
  template: string;
  status: string;
  logo: string;
  signatureName: string;
  signatureTitle: string;
  signatureImage: string;
  stampEnabled: boolean;
  stampImage: string;
  projectName: string;
  trainerName: string;
}

export default function CertificateForm({
  mode,
  students,
  courses,
  company,
  initialData,
}: CertificateFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => ({
    studentId: initialData?.studentId ?? students[0]?.id ?? "",
    courseId: initialData?.courseId ?? courses[0]?.id ?? "",
    fatherName: initialData?.fatherName ?? "",
    technology: initialData?.technology ?? "",
    projectName: initialData?.projectName ?? "",
    trainerName: initialData?.trainerName ?? "",
    type: initialData?.type ?? "training",
    duration: initialData?.duration ?? "",
    startDate: toDateInputValue(initialData?.startDate),
    endDate: toDateInputValue(initialData?.endDate),
    issueDate: toDateInputValue(initialData?.issueDate),
    expiryDate: toDateInputValue(initialData?.expiryDate),
    template: initialData?.template ?? "classic",
    status: initialData?.status ?? "draft",
    logo: initialData?.logo ?? company.logo ?? "/logo.jpg",
    signatureName: initialData?.authorizedSignature?.name ?? "",
    signatureTitle: initialData?.authorizedSignature?.title ?? "",
    signatureImage: initialData?.authorizedSignature?.imageUrl ?? "",
    stampEnabled: initialData?.officialStamp?.enabled ?? false,
    stampImage: initialData?.officialStamp?.imageUrl ?? "",
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === form.studentId),
    [students, form.studentId]
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleStudentChange(id: string) {
    setForm((prev) => {
      const student = students.find((s) => s.id === id);
      return {
        ...prev,
        studentId: id,
        fatherName: prev.fatherName || student?.fatherName || "",
      };
    });
  }

  const previewData = useMemo(() => {
    return {
      studentName: selectedStudent?.name ?? "",
      fatherName: form.fatherName || undefined,
      courseTitle: courses.find((c) => c.id === form.courseId)?.title ?? "",
      technology: form.technology || undefined,
      type: form.type,
      duration: form.duration,
      startDate: form.startDate,
      endDate: form.endDate,
      issueDate: form.issueDate,
      referenceNo: initialData?.referenceNo ?? "",
      certificateNo: initialData?.certificateNo ?? "",
      qrImageUrl: initialData?.qrImageUrl ?? QR_PLACEHOLDER,
      company: {
        name: company.name,
        tagline: company.tagline,
        logo: form.logo || company.logo,
        email: company.email,
        website: company.website,
        addressLines: company.addressLines,
        msmeNumber: company.msmeNumber,
      },
      authorizedSignature: {
        name: form.signatureName,
        title: form.signatureTitle,
        imageUrl: form.signatureImage,
      },
      officialStamp: {
        enabled: form.stampEnabled,
        imageUrl: form.stampImage,
      },
    };
  }, [form, selectedStudent, courses, company, initialData]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        student: form.studentId,
        course: form.courseId,
        fatherName: form.fatherName,
        technology: form.technology,
        projectName: form.projectName,
        trainerName: form.trainerName,
        type: form.type,
        duration: form.duration,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        issueDate: form.issueDate ? new Date(form.issueDate).toISOString() : undefined,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
        template: form.template,
        status: form.status,
        logo: form.logo,
        authorizedSignature: {
          name: form.signatureName,
          title: form.signatureTitle,
          imageUrl: form.signatureImage || undefined,
        },
        officialStamp: {
          enabled: form.stampEnabled,
          imageUrl: form.stampImage || undefined,
        },
      };

      const url =
        mode === "edit" && initialData
          ? `/api/certificates/${initialData.id}`
          : "/api/certificates";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success: boolean; error?: string; certificate?: CertificateView };

      if (!response.ok || !result.success) {
        setError(result.error ?? "Could not save certificate.");
        return;
      }

      router.push(`/admin/certificates/${result.certificate?.id ?? initialData?.id}`);
      router.refresh();
    } catch {
      setError("Could not save certificate. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_520px]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/certificates"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-300"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {mode === "create" ? "Issue New Certificate" : `Edit ${initialData?.certificateNo ?? "Certificate"}`}
            </h1>
          </div>

          <Section title="Student & Course">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Student" hint="Father's name auto-fills from the selected student.">
                <select
                  className={inputClasses}
                  value={form.studentId}
                  onChange={(event) => handleStudentChange(event.target.value)}
                >
                  {students.length === 0 ? <option value="">No students yet</option> : null}
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Father's Name">
                <input
                  className={inputClasses}
                  value={form.fatherName}
                  onChange={(event) => set("fatherName", event.target.value)}
                />
              </Field>
              <Field label="Course">
                <select
                  className={inputClasses}
                  value={form.courseId}
                  onChange={(event) => set("courseId", event.target.value)}
                >
                  {courses.length === 0 ? <option value="">No courses yet</option> : null}
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Technology / Specialization" hint="Optional — shown below the course title.">
                <input
                  className={inputClasses}
                  value={form.technology}
                  onChange={(event) => set("technology", event.target.value)}
                />
              </Field>
              <Field label="Project Name" hint="Optional — stored for records.">
                <input
                  className={inputClasses}
                  value={form.projectName}
                  onChange={(event) => set("projectName", event.target.value)}
                />
              </Field>
              <Field label="Trainer Name" hint="Optional — stored for records.">
                <input
                  className={inputClasses}
                  value={form.trainerName}
                  onChange={(event) => set("trainerName", event.target.value)}
                />
              </Field>
            </div>
          </Section>

          <Section title="Certificate Details">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Type">
                <select className={inputClasses} value={form.type} onChange={(event) => set("type", event.target.value)}>
                  {Object.entries(CERTIFICATE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Duration">
                <input
                  className={inputClasses}
                  placeholder="e.g. 6 Weeks / 3 Months"
                  value={form.duration}
                  onChange={(event) => set("duration", event.target.value)}
                />
              </Field>
              <Field label="Template">
                <select
                  className={inputClasses}
                  value={form.template}
                  onChange={(event) => set("template", event.target.value)}
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </Field>
              <Field label="Start Date">
                <input
                  type="date"
                  className={inputClasses}
                  value={form.startDate}
                  onChange={(event) => set("startDate", event.target.value)}
                />
              </Field>
              <Field label="End Date">
                <input
                  type="date"
                  className={inputClasses}
                  value={form.endDate}
                  onChange={(event) => set("endDate", event.target.value)}
                />
              </Field>
              <Field label="Issue Date">
                <input
                  type="date"
                  className={inputClasses}
                  value={form.issueDate}
                  onChange={(event) => set("issueDate", event.target.value)}
                />
              </Field>
              <Field label="Expiry Date" hint="Optional. When set, the certificate shows as Expired after this date.">
                <input
                  type="date"
                  className={inputClasses}
                  value={form.expiryDate}
                  onChange={(event) => set("expiryDate", event.target.value)}
                />
              </Field>
              <Field label="Status">
                <select
                  className={inputClasses}
                  value={form.status}
                  onChange={(event) => set("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="revoked">Revoked</option>
                </select>
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 dark:border-navy-700 dark:bg-navy-800/50">
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                  Reference Number (auto)
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {initialData?.referenceNo ?? "Generated on save"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                  Certificate Number (auto)
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {initialData?.certificateNo ?? "FLY-2026-XXXXXX"}
                </p>
              </div>
            </div>
          </Section>

          <Section title="Branding & Approvals">
            <div className="space-y-5">
              <Field label="Company Logo" hint="Loaded from company settings. Override per certificate (URL or /path).">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-navy-700 dark:bg-navy-800">
                    <Image
                      src={form.logo || LOGO_PLACEHOLDER}
                      alt="Logo preview"
                      width={44}
                      height={44}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </span>
                  <input
                    className={inputClasses}
                    value={form.logo}
                    onChange={(event) => set("logo", event.target.value)}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Authorized Signature — Name">
                  <input
                    className={inputClasses}
                    value={form.signatureName}
                    onChange={(event) => set("signatureName", event.target.value)}
                  />
                </Field>
                <Field label="Authorized Signature — Title">
                  <input
                    className={inputClasses}
                    placeholder="e.g. Director / CEO"
                    value={form.signatureTitle}
                    onChange={(event) => set("signatureTitle", event.target.value)}
                  />
                </Field>
              </div>

              <Field label="Signature Image" hint="Leave blank to use the placeholder signature.">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-navy-700 dark:bg-navy-800">
                    <Image
                      src={form.signatureImage || SIGNATURE_PLACEHOLDER}
                      alt="Signature preview"
                      width={44}
                      height={44}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </span>
                  <input
                    className={inputClasses}
                    placeholder="/certificate/signature-placeholder.svg"
                    value={form.signatureImage}
                    onChange={(event) => set("signatureImage", event.target.value)}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-navy-700">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Official Stamp</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Print the stamp on the certificate.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.stampEnabled}
                    onChange={(event) => set("stampEnabled", event.target.checked)}
                    className="size-5 accent-tech-500"
                  />
                </div>
                <Field label="Stamp Image" hint="Leave blank to use the placeholder stamp.">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-navy-700 dark:bg-navy-800">
                      <Image
                        src={form.stampImage || STAMP_PLACEHOLDER}
                        alt="Stamp preview"
                        width={44}
                        height={44}
                        className="size-full object-contain"
                        unoptimized
                      />
                    </span>
                    <input
                      className={inputClasses}
                      placeholder="/certificate/stamp-placeholder.svg"
                      value={form.stampImage}
                      onChange={(event) => set("stampImage", event.target.value)}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </Section>
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Live Preview</h2>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                A4 · 300 DPI
              </span>
            </div>
            <CertificatePreview data={previewData} />
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/admin/certificates"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg bg-tech-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {mode === "create" ? "Issue Certificate" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
