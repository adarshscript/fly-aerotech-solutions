"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CERTIFICATE_TYPE_LABELS,
  formatCertificateDate,
  LOGO_PLACEHOLDER,
  QR_PLACEHOLDER,
  SIGNATURE_PLACEHOLDER,
  STAMP_PLACEHOLDER,
  type CertificatePreviewData,
} from "@/components/certificates/preview-types";

export const PREVIEW_WIDTH = 794;
export const PREVIEW_HEIGHT = 1123;

interface CertificatePreviewProps {
  data: CertificatePreviewData;
  className?: string;
}

export default function CertificatePreview({ data, className }: CertificatePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(el.clientWidth / PREVIEW_WIDTH, 1));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const typeLabel = CERTIFICATE_TYPE_LABELS[data.type] ?? data.type;
  const titleText = data.type === "training" ? "CERTIFICATE OF COMPLETION" : `CERTIFICATE OF ${typeLabel.toUpperCase()}`;
  const startDate = formatCertificateDate(data.startDate);
  const endDate = formatCertificateDate(data.endDate);
  const issueDate = formatCertificateDate(data.issueDate);
  const qrSrc = data.qrImageUrl && data.qrImageUrl !== QR_PLACEHOLDER ? data.qrImageUrl : QR_PLACEHOLDER;
  const logoSrc = data.company.logo || LOGO_PLACEHOLDER;
  const signatureSrc = data.authorizedSignature.imageUrl || SIGNATURE_PLACEHOLDER;
  const stampSrc = data.officialStamp.imageUrl || STAMP_PLACEHOLDER;

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      style={{ height: PREVIEW_HEIGHT * scale }}
    >
      <div
        className="relative origin-top-left"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, transform: `scale(${scale})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
          <div className="absolute inset-[26px] border-[3px] border-navy-900" />
          <div className="absolute inset-[40px] border-2 border-amber-700/80" />
          <div className="absolute inset-[48px] border border-amber-500/50" />
        </div>

        <div className="absolute inset-[48px] bg-white font-serif text-navy-950">
          {/* Top metadata */}
          <div className="absolute top-8 left-9 right-9 flex justify-between text-[11px] tracking-wide text-slate-500">
            <span>Ref. No: {data.referenceNo || "CER-2026-XXXXXX"}</span>
            <span>Certificate No: {data.certificateNo || "FLY-2026-000000"}</span>
          </div>

          {/* Logo */}
          <div className="absolute top-14 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <div className="relative h-[96px] w-[96px] overflow-hidden rounded-full border-2 border-amber-600/40 bg-white">
              <Image src={logoSrc} alt="Company logo" fill className="object-contain p-2" unoptimized />
            </div>
          </div>

          {/* Company name + tagline */}
          <div className="absolute top-[170px] right-16 left-16 text-center">
            <h2 className="text-[30px] font-bold tracking-wide text-navy-900">{data.company.name}</h2>
            {data.company.tagline ? (
              <p className="mt-1 text-[14px] tracking-wide text-slate-500 italic">{data.company.tagline}</p>
            ) : null}
          </div>

          <div className="absolute top-[250px] left-1/2 flex w-[420px] -translate-x-1/2 items-center justify-center gap-3">
            <span className="h-[2px] flex-1 bg-amber-700" />
            <span className="size-[9px] rotate-45 bg-amber-700" />
            <span className="h-[2px] flex-1 bg-amber-700" />
          </div>

          {/* Title */}
          <div className="absolute top-[285px] right-12 left-12 text-center">
            <h1 className="text-[46px] font-bold tracking-[4px] text-navy-900">{titleText}</h1>
            <p className="mt-1 text-[15px] tracking-[6px] text-amber-700 italic">— {typeLabel} —</p>
          </div>

          {/* Body */}
          <div className="absolute top-[400px] right-14 left-14 text-center">
            <p className="text-[18px] text-navy-800 italic">This is to certify that</p>
            <p className="mt-5 text-[54px] leading-none font-bold text-navy-900">
              {data.studentName ? data.studentName.toUpperCase() : "STUDENT NAME"}
            </p>
          </div>
          <div className="absolute top-[500px] left-1/2 flex w-[340px] -translate-x-1/2 items-center justify-center gap-3">
            <span className="h-[2px] flex-1 bg-amber-700" />
            <span className="size-[8px] rotate-45 bg-amber-700" />
            <span className="h-[2px] flex-1 bg-amber-700" />
          </div>

          <div className="absolute top-[525px] right-16 left-16 text-center">
            {data.fatherName ? (
              <p className="text-[17px] text-navy-800 italic">S/o {data.fatherName}</p>
            ) : null}
            <div className="mx-auto mt-6 max-w-[560px] space-y-1 text-[17px] leading-7 text-navy-900">
              <p>has successfully completed the {typeLabel.toLowerCase()} program in</p>
              <p className="text-[22px] font-bold text-navy-900">{data.courseTitle || "Course Title"}</p>
              {data.technology ? (
                <p>with specialization in {data.technology}</p>
              ) : null}
              <p>
                during the period {startDate || "—"} to {endDate || "—"}, spanning a duration of {data.duration || "—"}.
              </p>
            </div>
          </div>

          {/* Bottom: QR, signature, stamp */}
          <div className="absolute right-16 bottom-[130px] left-16">
            <div className="flex items-end justify-between">
              {/* QR */}
              <div className="flex w-[150px] flex-col items-center">
                <div className="border border-amber-500/50 bg-white p-1">
                  <Image src={qrSrc} alt="Verification QR code" width={118} height={118} className="h-auto" unoptimized />
                </div>
                <p className="mt-1.5 text-[10px] tracking-wide text-slate-500">Scan to verify</p>
              </div>

              {/* Signature */}
              <div className="flex w-[220px] flex-col items-center text-center">
                <div className="relative h-[64px] w-[170px]">
                  <Image src={signatureSrc} alt="Authorized signature" fill className="object-contain object-bottom" unoptimized />
                </div>
                {data.authorizedSignature.name ? (
                  <>
                    <p className="mt-1 text-[16px] font-bold text-navy-900">{data.authorizedSignature.name}</p>
                    <p className="text-[12px] text-slate-500 italic">
                      {data.authorizedSignature.title || "Authorized Signatory"}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-[13px] text-slate-500 italic">Authorized Signatory</p>
                )}
              </div>

              {/* Stamp */}
              <div className="w-[150px]">
                {data.officialStamp.enabled ? (
                  <div className="ml-auto h-[110px] w-[110px] opacity-90">
                    <Image src={stampSrc} alt="Official stamp" width={110} height={110} className="h-auto" unoptimized />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute right-12 bottom-10 left-12 border-t border-slate-200 pt-3 text-center">
            <p className="text-[11px] tracking-wide text-slate-500">
              {data.company.addressLines.join(", ")}
              {data.company.website ? `  |  ${data.company.website.replace(/^https?:\/\//, "")}` : ""}
              {data.company.email ? `  |  ${data.company.email}` : ""}
            </p>
            <p className="mt-1 text-[11px] tracking-wide text-slate-500">
              Issued on {issueDate || "—"}
              {data.company.msmeNumber ? `  •  MSME: ${data.company.msmeNumber}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
