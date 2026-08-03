import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import CertificatePreview from "@/components/certificates/CertificatePreview";
import DownloadPdfButton from "@/components/certificates/DownloadPdfButton";
import PrintButton from "@/components/certificates/PrintButton";
import { QR_PLACEHOLDER } from "@/components/certificates/preview-types";
import {
  getCertificateCompanyView,
  getCertificateViewById,
} from "@/services/certificate.service";

export const metadata: Metadata = {
  title: "Certificate Details",
  description: "View certificate details, preview and download the PDF.",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  issued: "bg-tech-500/15 text-tech-600 dark:text-tech-400",
  revoked: "bg-red-500/15 text-red-600 dark:text-red-400",
  duplicate: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
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

export default async function CertificateDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [certificate, company] = await Promise.all([
    getCertificateViewById(id),
    getCertificateCompanyView(),
  ]);

  if (!certificate) notFound();

  const previewData = {
    studentName: certificate.studentName,
    fatherName: certificate.fatherName,
    courseTitle: certificate.courseTitle,
    technology: certificate.technology,
    type: certificate.type,
    duration: certificate.duration,
    startDate: certificate.startDate,
    endDate: certificate.endDate,
    issueDate: certificate.issueDate,
    referenceNo: certificate.referenceNo,
    certificateNo: certificate.certificateNo,
    qrImageUrl: certificate.qrImageUrl ?? QR_PLACEHOLDER,
    company: {
      name: company.name,
      tagline: company.tagline,
      logo: certificate.logo || company.logo,
      email: company.email,
      website: company.website,
      addressLines: company.addressLines,
      msmeNumber: company.msmeNumber,
    },
    authorizedSignature: certificate.authorizedSignature,
    officialStamp: certificate.officialStamp,
  };

  const verifyUrl = `/certificate-verify?ref=${encodeURIComponent(certificate.referenceNo)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/certificates"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-tech-600 dark:text-slate-400"
          >
            <ArrowLeft className="size-4" />
            Back to certificates
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              {certificate.certificateNo}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[certificate.status] ?? STATUS_STYLES.draft}`}
            >
              {certificate.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
            {certificate.referenceNo}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DownloadPdfButton
            variant="solid"
            fallbackUrl={`/api/certificates/${certificate.id}/pdf`}
            fileName={`${certificate.certificateNo}.pdf`}
          />
          <Link
            href={`/admin/certificates/${certificate.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200"
          >
            <Pencil className="size-4" />
            Edit
          </Link>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200"
            >
              <ShieldCheck className="size-4" />
              Verify page
              <ExternalLink className="size-3.5" />
            </a>
            <PrintButton />
          </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-navy-800 dark:bg-navy-900">
          <CertificatePreview data={previewData} />
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Certificate Details</h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Student" value={certificate.studentName} />
              <Detail label="Father's Name" value={certificate.fatherName || "—"} />
              <Detail label="Course" value={certificate.courseTitle} />
              <Detail label="Type" value={certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1)} />
              <Detail label="Technology" value={certificate.technology || "—"} />
              <Detail label="Duration" value={certificate.duration || "—"} />
              <Detail label="Start Date" value={formatDate(certificate.startDate)} />
              <Detail label="End Date" value={formatDate(certificate.endDate)} />
              <Detail label="Issue Date" value={formatDate(certificate.issueDate)} />
              <Detail label="Expiry Date" value={formatDate(certificate.expiryDate)} />
              <Detail label="Verified" value={certificate.isVerified ? "Yes" : "No"} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Branding & Approvals</h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Signature" value={certificate.authorizedSignature.name || "—"} />
              <Detail label="Signature Title" value={certificate.authorizedSignature.title || "—"} />
              <Detail label="Official Stamp" value={certificate.officialStamp.enabled ? "Enabled" : "Disabled"} />
              <Detail label="Template" value={certificate.template.charAt(0).toUpperCase() + certificate.template.slice(1)} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  );
}
