import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

export const QR_IMAGE_PLACEHOLDER = "/certificate/qr-placeholder.svg";
export const QR_PUBLIC_DIR = path.join(process.cwd(), "public", "certificates", "qr");

export interface CertificateQrPayload {
  certificateNo: string;
  referenceNo: string;
  studentId: string;
  type: string;
  issuedOn: string;
  verifyUrl: string;
}

export function buildVerificationUrl(referenceNo: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fly-aerotech-solutions.vercel.app";
  return `${base.replace(/\/$/, "")}/certificate-verify?ref=${encodeURIComponent(referenceNo)}`;
}

export function buildQrPayload(input: {
  certificateNo: string;
  referenceNo: string;
  studentId: string;
  type: string;
  issuedOn: Date;
}): string {
  const payload: CertificateQrPayload = {
    certificateNo: input.certificateNo,
    referenceNo: input.referenceNo,
    studentId: input.studentId,
    type: input.type,
    issuedOn: input.issuedOn.toISOString(),
    verifyUrl: buildVerificationUrl(input.referenceNo),
  };
  return JSON.stringify(payload);
}

export interface GenerateQrOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

export async function generateQrPngBuffer(
  payload: string,
  options: GenerateQrOptions = {}
): Promise<Buffer> {
  return QRCode.toBuffer(payload, {
    type: "png",
    width: options.width ?? 512,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "H",
    color: { dark: "#0f2a4a", light: "#ffffff" },
  });
}

export async function generateQrDataUrl(
  payload: string,
  options: GenerateQrOptions = {}
): Promise<string> {
  return QRCode.toDataURL(payload, {
    type: "image/png",
    width: options.width ?? 512,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "H",
    color: { dark: "#0f2a4a", light: "#ffffff" },
  });
}

/**
 * Persists a QR PNG under `public/certificates/qr/` so the browser preview and
 * the generated PDF can reference it by URL. Best-effort — returns the public
 * URL path even if writing fails (callers can fall back to a placeholder).
 */
export async function saveQrImage(referenceNo: string, payload: string): Promise<string> {
  const safeRef = referenceNo.replace(/[^A-Za-z0-9_-]/g, "_");
  const fileName = `${safeRef}.png`;
  const publicPath = `/certificates/qr/${fileName}`;

  try {
    await fs.mkdir(QR_PUBLIC_DIR, { recursive: true });
    const buffer = await generateQrPngBuffer(payload);
    await fs.writeFile(path.join(QR_PUBLIC_DIR, fileName), buffer);
    return publicPath;
  } catch {
    return QR_IMAGE_PLACEHOLDER;
  }
}
