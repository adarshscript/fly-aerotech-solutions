import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import CertificatePreview from "@/components/certificates/CertificatePreview";
import PrintButton from "@/components/certificates/PrintButton";
import {
  buildCertificatePreviewData,
  formatCertificateDate,
} from "@/components/certificates/preview-types";
import {
  getCertificateCompanyView,
  getPublicCertificateView,
} from "@/services/certificate.service";

export const metadata: Metadata = {
  title: "View Certificate",
  description: "View and download your Fly Aerotech Solutions certificate.",
};

export const dynamic = "force-dynamic";

interface ViewPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function CertificateViewPage({ searchParams }: ViewPageProps) {
  const { ref } = await searchParams;
  const reference = ref?.trim() ?? "";

  const [certificate, company] = reference
    ? await Promise.all([getPublicCertificateView(reference), getCertificateCompanyView()])
    : [null, null];

  if (!certificate || !company) {
    return (
      <section className="section-padding">
        <div className="container-site">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center">
            <ShieldCheck className="mx-auto size-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">Certificate Not Found</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              This certificate could not be found or is no longer valid.
            </p>
            <Link
              href="/certificate-verify"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950"
            >
              Verify a certificate
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const previewData = buildCertificatePreviewData(certificate, company);

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl dark:text-white">
              {certificate.studentName}&apos;s Certificate
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-mono">{certificate.certificateNo}</span> · Verified and issued by{" "}
              {company.name}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-navy-800 dark:bg-navy-900">
            <CertificatePreview data={previewData} />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
            <a
              href={`/api/certificates/public/pdf?ref=${encodeURIComponent(certificate.referenceNo)}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-tech-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
            >
              <Download className="size-4" />
              Download PDF (300 DPI)
            </a>
            <PrintButton />
          </div>

          <p className="mt-4 text-center text-xs text-slate-400 print:hidden">
            Issued on {formatCertificateDate(certificate.issueDate)} · Verified via QR scan
          </p>
        </div>
      </div>
    </section>
  );
}
