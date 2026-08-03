"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import CertificatePreview from "@/components/certificates/CertificatePreview";
import {
  buildCertificatePreviewData,
  type CertificatePreviewData,
} from "@/components/certificates/preview-types";
import { downloadCertificatePdf } from "@/lib/certificate-download";

interface VerifyDownloadButtonProps {
  referenceNo: string;
  certificateNo?: string;
  className?: string;
}

export default function VerifyDownloadButton({
  referenceNo,
  certificateNo,
  className,
}: VerifyDownloadButtonProps) {
  const [busy, setBusy] = useState(false);
  const [previewData, setPreviewData] = useState<CertificatePreviewData | null>(null);

  async function loadPreviewData(): Promise<CertificatePreviewData> {
    const res = await fetch(`/api/certificates/public?ref=${encodeURIComponent(referenceNo)}`);
    if (!res.ok) throw new Error(`Failed to load certificate (${res.status})`);
    const json = await res.json();
    if (!json.success || !json.certificate) {
      throw new Error(json.error || "Failed to load certificate");
    }
    return buildCertificatePreviewData(json.certificate, json.company);
  }

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      let data = previewData;
      if (!data) {
        data = await loadPreviewData();
        setPreviewData(data);
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      await downloadCertificatePdf(`${certificateNo || referenceNo || "Certificate"}.pdf`);
    } catch (error) {
      console.error("[certificate-verify] Failed to generate PDF:", error);
      window.open(
        `/api/certificates/public/pdf?ref=${encodeURIComponent(referenceNo)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {previewData ? (
        <div
          aria-hidden
          className="pointer-events-none fixed top-0 left-[-100000px] z-[-1]"
          style={{ width: 1123 }}
        >
          <CertificatePreview data={previewData} />
        </div>
      ) : null}
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-navy-700 dark:text-slate-200 dark:hover:text-tech-400 ${className ?? ""}`}
      >
        {busy ? (
          <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-navy-600 dark:border-t-slate-200" />
        ) : (
          <Download className="size-4" />
        )}
        {busy ? "Generating…" : "Download PDF"}
      </button>
    </>
  );
}
