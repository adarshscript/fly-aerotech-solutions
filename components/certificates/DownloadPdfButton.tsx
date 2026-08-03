"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { downloadCertificatePdf } from "@/lib/certificate-download";

interface DownloadPdfButtonProps {
  fileName: string;
  fallbackUrl?: string;
  label?: string;
  variant?: "solid" | "outline";
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<NonNullable<DownloadPdfButtonProps["variant"]>, string> = {
  solid:
    "bg-tech-500 text-navy-950 shadow-lg shadow-tech-500/25 hover:bg-tech-400",
  outline:
    "border border-slate-300 text-slate-700 hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200 dark:hover:text-tech-400",
};

export default function DownloadPdfButton({
  fileName,
  fallbackUrl,
  label = "Download PDF",
  variant = "solid",
  className,
}: DownloadPdfButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      await downloadCertificatePdf(fileName, fallbackUrl);
    } catch (error) {
      console.error("[certificate] Failed to generate PDF:", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className={`${BASE} ${VARIANTS[variant]} ${className ?? ""}`}
    >
      <Download className="size-4" />
      {busy ? "Generating…" : label}
    </button>
  );
}
