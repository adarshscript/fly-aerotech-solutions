import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Download, Eye, SearchX, ShieldAlert, ShieldCheck } from "lucide-react";
import VerifyForm from "@/components/certificates/VerifyForm";
import PrintButton from "@/components/certificates/PrintButton";
import { verifyCertificateByReference } from "@/services/certificate.service";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description:
    "Verify Fly Aerotech Solutions certificates instantly using their unique reference or certificate number.",
};

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  searchParams: Promise<{ ref?: string }>;
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function CertificateVerifyPage({ searchParams }: VerifyPageProps) {
  const { ref } = await searchParams;
  const reference = ref?.trim() ?? "";
  const result = reference ? await verifyCertificateByReference(reference) : null;

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-tech-500/30 bg-tech-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-tech-600 uppercase dark:text-tech-400">
              <span className="size-1.5 rounded-full bg-tech-500" aria-hidden />
              Verified by Fly Aerotech Solutions
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl dark:text-white">
              Certificate Verification
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Enter the reference number printed on your certificate, or scan the QR code on the
              certificate to jump straight here.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <VerifyForm initialValue={reference} />
          </div>

          {!reference ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <SearchX className="mx-auto size-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Waiting for a certificate number. Enter one above to verify its authenticity.
              </p>
            </div>
          ) : result ? (
            <ResultCard
              status={result.status}
              certificateNo={result.certificate?.certificateNo}
              referenceNo={result.certificate?.referenceNo}
              studentName={result.certificate?.studentName}
              fatherName={result.certificate?.fatherName}
              courseTitle={result.certificate?.courseTitle}
              type={result.certificate?.type}
              technology={result.certificate?.technology}
              duration={result.certificate?.duration}
              startDate={result.certificate?.startDate}
              endDate={result.certificate?.endDate}
              issueDate={result.certificate?.issueDate}
              companyName={result.certificate?.companyName}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface ResultCardProps {
  status: "verified" | "revoked" | "not-found" | "expired";
  certificateNo?: string;
  referenceNo?: string;
  studentName?: string;
  fatherName?: string;
  courseTitle?: string;
  type?: string;
  technology?: string;
  duration?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  issueDate?: Date | null;
  companyName?: string;
}

function ResultCard(props: ResultCardProps) {
  if (props.status === "not-found") {
    return (
      <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <SearchX className="mx-auto size-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-red-600">Certificate Not Found</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          No certificate matches the number <span className="font-mono font-semibold">{props.referenceNo}</span>.
          Double-check the number or contact Fly Aerotech Solutions.
        </p>
      </div>
    );
  }

  if (props.status === "revoked") {
    return (
      <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <ShieldAlert className="mx-auto size-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-red-600">Certificate Revoked</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This certificate has been revoked and is no longer valid.
        </p>
        <p className="mt-4 font-mono text-sm text-slate-500">{props.certificateNo}</p>
      </div>
    );
  }

  if (props.status === "expired") {
    return (
      <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-8 text-center">
        <Clock className="mx-auto size-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-amber-600">Certificate Expired</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This certificate was issued by {props.companyName ?? "Fly Aerotech Solutions"} but has passed its
          validity period.
        </p>
        <p className="mt-4 font-mono text-sm text-slate-500">{props.certificateNo}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-tech-500/30 bg-white shadow-sm dark:border-tech-500/30 dark:bg-navy-900">
      <div className="flex items-center gap-3 bg-tech-500/10 px-6 py-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-tech-500 text-navy-950">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-tech-600 dark:text-tech-400">Verified</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This certificate is authentic and issued by {props.companyName ?? "Fly Aerotech Solutions"}.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-6 py-6">
        <div className="rounded-xl border border-slate-200 p-5 text-center dark:border-navy-700">
          <p className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            {props.studentName ?? "Student"}
          </p>
          {props.fatherName ? (
            <p className="mt-1 text-sm text-slate-500 italic dark:text-slate-400">S/o {props.fatherName}</p>
          ) : null}
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            successfully completed the <span className="font-semibold capitalize">{props.type}</span> program in
          </p>
          <p className="mt-1 text-base font-semibold text-navy-900 dark:text-white">{props.courseTitle}</p>
          {props.technology ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">Specialization: {props.technology}</p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="Certificate No" value={props.certificateNo} mono />
          <Detail label="Reference No" value={props.referenceNo} mono />
          <Detail label="Duration" value={props.duration} />
          <Detail label="Period" value={`${formatDate(props.startDate)} → ${formatDate(props.endDate)}`} />
          <Detail label="Issue Date" value={formatDate(props.issueDate)} />
          <Detail label="Status" value="Active" />
        </dl>

        {props.referenceNo ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/certificate/view?ref=${encodeURIComponent(props.referenceNo)}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-tech-500 px-4 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
            >
              <Eye className="size-4" />
              View Certificate
            </Link>
            <a
              href={`/api/certificates/public/pdf?ref=${encodeURIComponent(props.referenceNo)}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200 dark:hover:text-tech-400"
            >
              <Download className="size-4" />
              Download PDF
            </a>
            <PrintButton className="flex-1" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-navy-700">
      <dt className="text-[11px] font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {label}
      </dt>
      <dd className={`mt-0.5 font-medium text-slate-800 dark:text-slate-100 ${mono ? "font-mono text-[13px]" : ""}`}>
        {value || "—"}
      </dd>
    </div>
  );
}
