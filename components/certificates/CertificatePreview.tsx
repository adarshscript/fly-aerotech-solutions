"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CERTIFICATE_LOCATION,
  CERTIFICATE_TYPE_LABELS,
  formatCertificateDate,
  LOGO_PLACEHOLDER,
  QR_PLACEHOLDER,
  SIGNATURE_PLACEHOLDER,
  STAMP_PLACEHOLDER,
  type CertificatePreviewData,
} from "@/components/certificates/preview-types";

export const PREVIEW_WIDTH = 1123;
export const PREVIEW_HEIGHT = 794;

const VERIFY_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fly-aerotech-solutions.vercel.app";

function IconMapPin() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconBadgeCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Circuit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      <path d="M10 10h64v26h30" strokeWidth="1.5" />
      <path d="M10 150h42v-50h42" strokeWidth="1.5" />
      <path d="M122 10v34h28" strokeWidth="1.5" />
      <path d="M150 150h-42v-26" strokeWidth="1.5" />
      <path d="M86 60h22v22H86z" strokeWidth="1" />
      <circle cx="108" cy="36" r="3" />
      <circle cx="10" cy="100" r="3" />
      <circle cx="150" cy="96" r="3" />
    </svg>
  );
}

interface CertificatePreviewProps {
  data: CertificatePreviewData;
  className?: string;
}

export default function CertificatePreview({ data, className }: CertificatePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [verifyUrl, setVerifyUrl] = useState("");

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(el.clientWidth / PREVIEW_WIDTH, 1));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!data.referenceNo) return;
    const id = setTimeout(() => {
      setVerifyUrl(`${VERIFY_SITE_URL}/certificate-verify?ref=${encodeURIComponent(data.referenceNo)}`);
    }, 0);
    return () => clearTimeout(id);
  }, [data.referenceNo]);

  const typeLabel = CERTIFICATE_TYPE_LABELS[data.type] ?? data.type;
  const titleText =
    data.type === "training"
      ? "CERTIFICATE OF TRAINING COMPLETION"
      : `CERTIFICATE OF ${typeLabel.toUpperCase()} COMPLETION`;
  const startDate = formatCertificateDate(data.startDate);
  const endDate = formatCertificateDate(data.endDate);
  const issueDate = formatCertificateDate(data.issueDate);
  const qrSrc = data.qrImageUrl && data.qrImageUrl !== QR_PLACEHOLDER ? data.qrImageUrl : QR_PLACEHOLDER;
  const logoSrc = data.company.logo || LOGO_PLACEHOLDER;
  const signatureSrc = data.authorizedSignature.imageUrl || SIGNATURE_PLACEHOLDER;
  const stampSrc = data.officialStamp.imageUrl || STAMP_PLACEHOLDER;
  const studentName = data.studentName.toUpperCase() || "STUDENT NAME";
  const address = CERTIFICATE_LOCATION;
  const websiteDomain = data.company.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const companyName = data.company.name.toUpperCase() || "FLY AEROTECH SOLUTIONS";

  return (
    <div
      id="certificate-print-area"
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      style={{ height: PREVIEW_HEIGHT * scale }}
    >
      <div
        className="certificate-print-scale relative origin-top-left"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, transform: `scale(${scale})` }}
      >
        <div className="absolute inset-0 bg-[#FCFCF9]">
          <Circuit className="absolute top-[60px] left-[64px] h-40 w-40 text-navy-900 opacity-[0.06]" />
          <Circuit className="absolute right-[70px] bottom-[64px] h-44 w-44 -rotate-180 text-navy-900 opacity-[0.05]" />
          <Circuit className="absolute bottom-[86px] left-[96px] h-32 w-32 rotate-90 text-navy-900 opacity-[0.05]" />
        </div>

        {/* Double border */}
        <div className="absolute inset-[22px] rounded-sm border-[3px] border-[#0B2C63]" />
        <div className="absolute inset-[38px] rounded-[3px] border border-[#14B86A]" />

        {/* Geometric corner accents */}
        <span className="absolute top-[38px] left-[38px] size-3 border-t-2 border-l-2 border-[#0B2C63]" />
        <span className="absolute top-[38px] right-[38px] size-3 border-t-2 border-r-2 border-[#0B2C63]" />
        <span className="absolute bottom-[38px] left-[38px] size-3 border-b-2 border-l-2 border-[#0B2C63]" />
        <span className="absolute right-[38px] bottom-[38px] size-3 border-r-2 border-b-2 border-[#0B2C63]" />
        <span className="absolute top-[44px] left-[44px] size-1.5 rotate-45 bg-[#14B86A]" />
        <span className="absolute top-[44px] right-[44px] size-1.5 rotate-45 bg-[#14B86A]" />
        <span className="absolute bottom-[44px] left-[44px] size-1.5 rotate-45 bg-[#14B86A]" />
        <span className="absolute right-[44px] bottom-[44px] size-1.5 rotate-45 bg-[#14B86A]" />

        <div className="absolute inset-[54px] flex flex-col">
          {/* ---- Header ---- */}
          <div className="flex items-center justify-between gap-5">
            <div className="flex w-[200px] shrink-0 justify-start">
              <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-xl border border-[#DDE5EF] bg-[#F6F8FB] p-1.5">
                <Image src={logoSrc} alt={`${data.company.name} logo`} width={88} height={88} className="h-auto w-auto object-contain" unoptimized />
              </div>
            </div>

            <div className="min-w-0 flex-1 px-2 text-center">
              <h2 className="truncate text-[29px] leading-tight font-extrabold tracking-[0.12em] text-[#0B2C63]">
                {companyName}
              </h2>
              <div className="mt-1.5 flex items-center justify-center gap-2.5">
                <span className="h-px w-9 bg-[#14B86A]" />
                <p className="text-[11.5px] font-bold tracking-[0.42em] text-[#14B86A]">SOFTWARE DEVELOPMENT</p>
                <span className="h-px w-9 bg-[#14B86A]" />
              </div>
            </div>

            <div className="flex w-[210px] shrink-0 flex-col items-end gap-[5px] text-right">
              {address ? (
                <p className="flex items-center gap-1.5 text-[10.5px] text-[#1F2937]">
                  <span className="shrink-0 text-[#14B86A]"><IconMapPin /></span>
                  <span className="max-w-[180px] truncate">{address}</span>
                </p>
              ) : null}
              {websiteDomain ? (
                <p className="flex items-center gap-1.5 text-[10.5px] text-[#1F2937]">
                  <span className="shrink-0 text-[#14B86A]"><IconGlobe /></span>
                  <span className="max-w-[180px] truncate">{websiteDomain}</span>
                </p>
              ) : null}
              {data.company.email ? (
                <p className="flex items-center gap-1.5 text-[10.5px] text-[#1F2937]">
                  <span className="shrink-0 text-[#14B86A]"><IconMail /></span>
                  <span className="max-w-[180px] truncate">{data.company.email}</span>
                </p>
              ) : null}
              {data.company.msmeNumber ? (
                <p className="flex items-center gap-1.5 text-[10.5px] text-[#1F2937]">
                  <span className="shrink-0 text-[#14B86A]"><IconBadgeCheck /></span>
                  <span className="max-w-[180px] truncate">
                    <span className="font-semibold text-[#0B2C63]">MSME:</span> {data.company.msmeNumber}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          {/* ---- Divider ---- */}
          <div className="mt-4 flex items-center gap-2.5">
            <div className="h-[2px] flex-1 rounded-full bg-[#0B2C63]" />
            <span className="size-[8px] rotate-45 bg-[#14B86A]" />
            <div className="h-[2px] flex-1 rounded-full bg-[#0B2C63]" />
          </div>

          {/* ---- Metadata ---- */}
          <div className="mt-3 flex items-end justify-between">
            <div className="text-left">
              <p className="text-[8.5px] font-bold tracking-[0.24em] text-[#0B2C63]">CERTIFICATE REF. NO.</p>
              <p className="mt-0.5 font-mono text-[12.5px] font-semibold text-[#1F2937]">
                {data.referenceNo || "FAS/2026/EXP-000000"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8.5px] font-bold tracking-[0.24em] text-[#0B2C63]">DATE OF ISSUE</p>
              <p className="mt-0.5 text-[12.5px] font-semibold text-[#1F2937]">{issueDate || "—"}</p>
            </div>
          </div>

          {/* ---- Title ---- */}
          <div className="mt-4 text-center">
            <h1 className="text-[42px] leading-none font-extrabold tracking-[0.03em] text-[#0B2C63]">{titleText}</h1>
            <p className="mt-2.5 text-[9.5px] font-semibold tracking-[0.5em] text-[#64748B]">
              TO WHOMSOEVER IT MAY CONCERN
            </p>
          </div>

          {/* ---- Body ---- */}
          <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[13.5px] font-medium text-[#1F2937]">This is to certify that</p>
            <p className="mt-1.5 px-6 text-[38px] leading-none font-extrabold tracking-wide text-[#14B86A] break-words">
              {studentName}
            </p>
            {data.fatherName ? (
              <p className="mt-1.5 text-[13px] font-medium text-[#64748B] italic">S/o {data.fatherName}</p>
            ) : null}
            <p className="mx-auto mt-3 max-w-[740px] text-[13.5px] leading-relaxed text-[#1F2937]">
              has successfully completed the professional {typeLabel.toLowerCase()} program in
            </p>
            <p className="mt-0.5 text-[20px] leading-tight font-bold text-[#14B86A]">
              {data.courseTitle || "Course Title"}
            </p>
            {data.technology ? (
              <p className="text-[13.5px] text-[#1F2937]">with specialization in {data.technology}</p>
            ) : null}
            <p className="mt-1.5 text-[13.5px] text-[#1F2937]">
              during the period <span className="font-semibold text-[#0B2C63]">{startDate || "—"}</span> to{" "}
              <span className="font-semibold text-[#0B2C63]">{endDate || "—"}</span>, spanning a duration of{" "}
              <span className="font-semibold text-[#0B2C63]">{data.duration || "—"}</span>.
            </p>
            <p className="mx-auto mt-3 max-w-[760px] text-[12.5px] leading-relaxed text-[#64748B]">
              During the program, {data.studentName || "the candidate"} demonstrated commendable dedication, technical
              aptitude and professional conduct. We congratulate them on this achievement and wish them continued
              success.
            </p>
          </div>

          {/* ---- Bottom: QR / stamp / signature (aligned row) ---- */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 flex-col items-center">
              <div className="flex h-[128px] w-[128px] items-center justify-center border border-[#DDE5EF] bg-white p-1.5 shadow-sm">
                <Image src={qrSrc} alt="Verification QR code" width={116} height={116} className="h-auto w-auto" unoptimized />
              </div>
              <p className="mt-1.5 text-[9px] font-bold tracking-[0.22em] text-[#0B2C63]">SCAN TO VERIFY</p>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <div className="flex h-[124px] w-[124px] items-center justify-center">
                <Image src={stampSrc} alt="Official company stamp" width={112} height={112} className="h-auto w-auto object-contain" unoptimized />
              </div>
              <p className="mt-1.5 text-[8.5px] font-bold tracking-[0.24em] text-[#64748B]">OFFICIAL COMPANY STAMP</p>
            </div>

            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-[66px] w-[200px] items-end justify-center">
                <Image
                  src={signatureSrc}
                  alt="Authorized signature"
                  width={200}
                  height={66}
                  className="h-auto max-h-[66px] w-auto max-w-[200px] object-contain object-bottom"
                  unoptimized
                />
              </div>
              <p className="mt-1 text-[10px] font-bold tracking-[0.18em] text-[#0B2C63]">AUTHORIZED SIGNATORY</p>
              <p className="text-[9.5px] font-medium text-[#64748B]">{data.company.name || "Fly Aerotech Solutions"}</p>
            </div>
          </div>

          {/* ---- Footer ---- */}
          <div className="mt-3 border-t border-[#DDE5EF] pt-2 text-center">
            <p className="mx-auto max-w-full truncate text-[9.5px] tracking-[0.06em] text-[#94A3B8]">
              {companyName} &nbsp;&bull;&nbsp; {address} &nbsp;&bull;&nbsp; {websiteDomain}
            </p>
            <p className="mx-auto mt-0.5 max-w-full truncate text-[9.5px] tracking-[0.06em] text-[#94A3B8]">
              Certificate verification:{" "}
              {verifyUrl || `/certificate-verify?ref=${data.referenceNo || ""}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
