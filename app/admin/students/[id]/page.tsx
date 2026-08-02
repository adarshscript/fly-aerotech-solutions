import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Edit3, Mail, MapPin, Phone } from "lucide-react";
import { getStudentAdminViewById } from "@/services/student.service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Student Details",
  description: "View a student's personal, training and certificate details.",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  active: "bg-tech-500/15 text-tech-600 dark:text-tech-400",
  completed: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  dropped: "bg-red-500/15 text-red-600 dark:text-red-400",
};

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const student = await getStudentAdminViewById(id);
  if (!student) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/students"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-tech-600 dark:text-slate-400"
          >
            <ArrowLeft className="size-4" />
            Back to students
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">{student.name}</h1>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                STATUS_STYLES[student.status] ?? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
              )}
            >
              {student.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">{student.referenceNo}</p>
        </div>

        <Link
          href={`/admin/students/${student.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
        >
          <Edit3 className="size-4" />
          Edit Student
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <div className="mx-auto flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 dark:border-navy-700 dark:bg-navy-800">
              {student.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.photo} alt={`${student.name}'s photo`} className="size-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-slate-300">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{student.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{student.courseTitle}</p>
            <div className="mt-4 flex flex-col items-center gap-1.5 text-sm">
              <p className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="size-3.5 text-slate-400" />
                {student.email}
              </p>
              <p className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="size-3.5 text-slate-400" />
                {student.phone}
              </p>
              {student.address || student.city ? (
                <p className="inline-flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                  <span>
                    {[student.address, [student.city, student.state].filter(Boolean).join(", ")]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              ) : null}
            </div>
          </section>

          {student.certificate ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-tech-500" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Certificate</h2>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <Detail label="Certificate No" value={student.certificate.certificateNo} mono />
                <Detail label="Reference No" value={student.certificate.referenceNo} mono />
                <Detail
                  label="Verified"
                  value={student.certificate.isVerified ? "Yes" : "No"}
                />
              </dl>
              <Link
                href={`/admin/certificates/${student.certificate.id}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200"
              >
                <Award className="size-4" />
                Open Certificate
              </Link>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-slate-300 p-6 text-center shadow-sm dark:border-navy-700">
              <Award className="mx-auto size-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                No certificate issued yet. Issue one from the Certificates section.
              </p>
              <Link
                href="/admin/certificates/new"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-tech-600 underline dark:text-tech-400"
              >
                Issue certificate
              </Link>
            </section>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Personal Details</h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Father's Name" value={student.fatherName || "—"} />
              <Detail label="Mother's Name" value={student.motherName || "—"} />
              <Detail
                label="Gender"
                value={student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "—"}
              />
              <Detail label="Date of Birth" value={formatDate(student.dateOfBirth)} />
              <Detail label="Pincode" value={student.pincode || "—"} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Training Details</h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Course" value={student.courseTitle || "—"} />
              <Detail label="Status" value={student.status.charAt(0).toUpperCase() + student.status.slice(1)} />
              <Detail label="Enrolled" value={formatDate(student.enrollmentDate)} />
              <Detail label="Reference No" value={student.referenceNo} mono />
              <Detail label="Registered" value={formatDate(student.createdAt)} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={cn("text-right font-medium text-slate-800 dark:text-slate-100", mono && "font-mono")}>
        {value}
      </dd>
    </div>
  );
}
