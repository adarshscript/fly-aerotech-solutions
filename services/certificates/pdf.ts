import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, degrees, type Color, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import { generateQrPngBuffer, buildVerificationUrl, type CertificateQrPayload } from "@/services/certificates/qr";

// A4 at 300 DPI
export const PAGE_WIDTH = 2480;
export const PAGE_HEIGHT = 3508;
const SCALE = 841.89 / PAGE_HEIGHT; // ~0.24 → A4 in PDF points

const NAVY = rgb(0.043, 0.153, 0.29);
const GOLD = rgb(0.72, 0.53, 0.12);
const DARK = rgb(0.13, 0.17, 0.22);
const MUTED = rgb(0.42, 0.46, 0.52);
const SOFT_GOLD = rgb(0.86, 0.78, 0.55);

export interface CertificatePdfData {
  certificateNo: string;
  referenceNo: string;
  studentName: string;
  fatherName?: string;
  courseTitle: string;
  technology?: string;
  type: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  logo: string;
  authorizedSignature: { name: string; title: string; imageUrl?: string };
  officialStamp: { imageUrl?: string; enabled: boolean };
  template: string;
  qrData?: string;
  qrImageUrl?: string;
  company: {
    name: string;
    tagline: string;
    address: string;
    email: string;
    website: string;
    msmeNumber: string;
  };
}

export interface CertificatePdfDocument {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  data: Uint8Array;
}

export interface BuildPdfInput {
  certificate: {
    certificateNo: string;
    referenceNo: string;
    type: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    issueDate: Date;
    technology?: string;
    fatherName?: string;
    logo: string;
    authorizedSignature: { name: string; title: string; imageUrl?: string };
    officialStamp: { imageUrl?: string; enabled: boolean };
    template: string;
    qrCode?: { data?: string; imageUrl?: string };
  };
  student: { name: string; fatherName?: string };
  course: { title: string };
  company: {
    name: string;
    tagline: string;
    address: string;
    email: string;
    website: string;
    msmeNumber: string;
  };
}

const TYPE_LABEL: Record<string, string> = {
  training: "Training",
  internship: "Internship",
  experience: "Experience",
  appreciation: "Appreciation",
};

export function formatCertificateDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

async function readImageBytes(src?: string): Promise<Buffer | null> {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith("data:")) {
      const comma = trimmed.indexOf(",");
      if (comma === -1) return null;
      return Buffer.from(trimmed.slice(comma + 1), "base64");
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const response = await fetch(trimmed, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    }
    if (trimmed.startsWith("/")) {
      return fs.readFile(path.join(process.cwd(), "public", trimmed));
    }
    return fs.readFile(path.join(process.cwd(), "public", trimmed));
  } catch {
    return null;
  }
}

async function embedImage(doc: PDFDocument, src?: string): Promise<PDFImage | null> {
  const bytes = await readImageBytes(src);
  if (!bytes) return null;
  try {
    if (src?.toLowerCase().endsWith(".png") || bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      return await doc.embedPng(bytes);
    }
    return await doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCenteredText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  centerX: number,
  y: number,
  options: { color?: Color } = {}
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: centerX - width / 2,
    y,
    size,
    font,
    color: options.color ?? DARK,
  });
  return width;
}

function drawGoldDivider(page: PDFPage, centerX: number, y: number, halfWidth: number) {
  page.drawLine({ start: { x: centerX - halfWidth, y }, end: { x: centerX - 18, y }, thickness: SCALE * 3, color: GOLD });
  page.drawLine({ start: { x: centerX + 18, y }, end: { x: centerX + halfWidth, y }, thickness: SCALE * 3, color: GOLD });
  page.drawRectangle({ x: centerX - 9 * SCALE, y: y - 7 * SCALE, width: 18 * SCALE, height: 18 * SCALE, color: GOLD, rotate: degrees(45) });
}

export async function buildCertificatePdfData(input: BuildPdfInput): Promise<CertificatePdfData> {
  const qrPayload: CertificateQrPayload = {
    certificateNo: input.certificate.certificateNo,
    referenceNo: input.certificate.referenceNo,
    studentId: "",
    type: input.certificate.type,
    issuedOn: input.certificate.issueDate.toISOString(),
    verifyUrl: buildVerificationUrl(input.certificate.referenceNo),
  };

  return {
    certificateNo: input.certificate.certificateNo,
    referenceNo: input.certificate.referenceNo,
    studentName: input.student.name,
    fatherName: input.certificate.fatherName ?? input.student.fatherName,
    courseTitle: input.course.title,
    technology: input.certificate.technology,
    type: TYPE_LABEL[input.certificate.type] ?? input.certificate.type,
    duration: input.certificate.duration,
    startDate: formatCertificateDate(input.certificate.startDate),
    endDate: formatCertificateDate(input.certificate.endDate),
    issueDate: formatCertificateDate(input.certificate.issueDate),
    logo: input.certificate.logo,
    authorizedSignature: input.certificate.authorizedSignature,
    officialStamp: input.certificate.officialStamp,
    template: input.certificate.template,
    qrData: input.certificate.qrCode?.data ?? JSON.stringify(qrPayload),
    qrImageUrl: input.certificate.qrCode?.imageUrl,
    company: input.company,
  };
}

function fileNameFor(certificateNo: string): string {
  const safe = certificateNo.replace(/[^A-Za-z0-9_-]/g, "_");
  return `${safe}.pdf`;
}

export async function buildCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setCreator("Fly Aerotech Solutions");
  doc.setProducer("Fly Aerotech Solutions Certificate Engine");

  const page = doc.addPage([PAGE_WIDTH * SCALE, PAGE_HEIGHT * SCALE]);
  const times = await doc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);

  const P = (value: number) => value * SCALE;
  const W = P(PAGE_WIDTH);
  const H = P(PAGE_HEIGHT);

  // ---- Outer double border ----
  const outerMargin = 64 * SCALE;
  const innerMargin = 96 * SCALE;
  const borderWidth = 3.5 * SCALE;
  page.drawRectangle({ x: outerMargin, y: outerMargin, width: W - outerMargin * 2, height: H - outerMargin * 2, borderColor: NAVY, borderWidth });
  page.drawRectangle({ x: innerMargin, y: innerMargin, width: W - innerMargin * 2, height: H - innerMargin * 2, borderColor: GOLD, borderWidth: 1.8 * SCALE });
  page.drawRectangle({ x: innerMargin + 14 * SCALE, y: innerMargin + 14 * SCALE, width: W - (innerMargin + 14 * SCALE) * 2, height: H - (innerMargin + 14 * SCALE) * 2, borderColor: SOFT_GOLD, borderWidth: 1 * SCALE });

  const contentTop = H - P(300);
  const centerX = W / 2;

  // ---- Top left / top right numbers ----
  page.drawText(`Ref. No: ${data.referenceNo}`, { x: P(170), y: H - P(190), size: P(26), font: helvetica, color: MUTED });
  page.drawText(`Certificate No: ${data.certificateNo}`, { x: P(170), y: H - P(240), size: P(26), font: helvetica, color: MUTED });

  const certNoWidth = helvetica.widthOfTextAtSize(`Certificate No: ${data.certificateNo}`, P(26));
  page.drawText(`Certificate No: ${data.certificateNo}`, { x: W - P(170) - certNoWidth, y: H - P(190), size: P(26), font: helvetica, color: MUTED });
  const refNoWidth = helvetica.widthOfTextAtSize(`Ref. No: ${data.referenceNo}`, P(26));
  page.drawText(`Ref. No: ${data.referenceNo}`, { x: W - P(170) - refNoWidth, y: H - P(240), size: P(26), font: helvetica, color: MUTED });

  // ---- Logo ----
  let logoY = contentTop - P(120);
  const logo = await embedImage(doc, data.logo);
  if (logo) {
    const logoSize = P(300);
    const logoBox = logo.scaleToFit(logoSize, logoSize);
    const logoX = centerX - logoBox.width / 2;
    logoY = logoBox.height > 0 ? H - P(470) - logoBox.height : logoY;
    page.drawImage(logo, { x: logoX, y: logoY, width: logoBox.width, height: logoBox.height });
  }

  // ---- Company name ----
  const companyNameSize = P(64);
  let y = logoY - P(110);
  const companyNameLines = wrapText(timesBold, data.company.name, companyNameSize, W - P(700));
  for (const line of companyNameLines) {
    drawCenteredText(page, timesBold, line, companyNameSize, centerX, y, { color: NAVY });
    y -= P(74);
  }

  // ---- Tagline ----
  if (data.company.tagline) {
    const taglineLines = wrapText(timesItalic, data.company.tagline, P(34), W - P(900));
    for (const line of taglineLines) {
      drawCenteredText(page, timesItalic, line, P(34), centerX, y, { color: MUTED });
      y -= P(44);
    }
  }

  y -= P(90);
  drawGoldDivider(page, centerX, y, P(430));
  y -= P(160);

  // ---- Title ----
  const titleSize = P(96);
  const title = data.type === "training" ? "CERTIFICATE OF COMPLETION" : `CERTIFICATE OF ${data.type.toUpperCase()}`;
  drawCenteredText(page, timesBold, title, titleSize, centerX, y, { color: NAVY });
  y -= P(60);
  drawCenteredText(page, timesItalic, "— " + data.type + " —", P(30), centerX, y, { color: GOLD });
  y -= P(150);

  // ---- Intro line ----
  drawCenteredText(page, timesItalic, "This is to certify that", P(40), centerX, y, { color: DARK });
  y -= P(130);

  // ---- Student name ----
  const nameSize = P(150);
  const nameText = data.studentName.toUpperCase();
  const nameWidth = timesBold.widthOfTextAtSize(nameText, nameSize);
  let nameY = y;
  if (nameWidth > W - P(560)) {
    const wrapped = wrapText(timesBold, data.studentName, P(120), W - P(560));
    nameY = y - (wrapped.length - 1) * P(130);
    wrapped.forEach((line, index) => drawCenteredText(page, timesBold, line.toUpperCase(), P(120), centerX, y - index * P(130), { color: NAVY }));
  } else {
    drawCenteredText(page, timesBold, nameText, nameSize, centerX, nameY, { color: NAVY });
  }
  y = nameY - P(90);
  drawGoldDivider(page, centerX, y, P(360));
  y -= P(120);

  // ---- Father name ----
  if (data.fatherName) {
    drawCenteredText(page, timesItalic, `S/o ${data.fatherName}`, P(38), centerX, y, { color: DARK });
    y -= P(110);
  }

  // ---- Body copy ----
  const bodySize = P(40);
  const bodyMaxWidth = W - P(900);
  const completedText = `has successfully completed the ${data.type.toLowerCase()} program in`;
  const bodyLines: string[] = wrapText(times, completedText, bodySize, bodyMaxWidth);
  bodyLines.push(data.courseTitle);
  if (data.technology) {
    bodyLines.push(`with specialization in ${data.technology}`);
  }
  bodyLines.push(`during the period ${data.startDate} to ${data.endDate},`);
  bodyLines.push(`spanning a duration of ${data.duration}.`);

  for (const line of bodyLines) {
    drawCenteredText(page, times, line, bodySize, centerX, y, { color: DARK });
    y -= P(60);
  }

  // ---- Bottom signatures row ----
  const bottomY = P(560);
  const left = P(560);
  const right = W - P(560);

  // QR block (left)
  let qr = null;
  if (data.qrImageUrl && data.qrImageUrl !== "/certificate/qr-placeholder.svg") {
    qr = await embedImage(doc, data.qrImageUrl);
  }
  if (!qr) {
    const qrBuffer = await generateQrPngBuffer(data.qrData ?? data.referenceNo, { width: 512, margin: 2 });
    qr = await doc.embedPng(qrBuffer);
  }
  if (qr) {
    const qrSize = P(230);
    page.drawRectangle({ x: left - P(24), y: bottomY - P(24), width: qrSize + P(48), height: qrSize + P(48), borderColor: SOFT_GOLD, borderWidth: 1 * SCALE });
    page.drawImage(qr, { x: left, y: bottomY, width: qrSize, height: qrSize });
    drawCenteredText(page, helvetica, "Scan to verify", P(22), left + qrSize / 2, bottomY - P(48), { color: MUTED });
  }

  // Signature (center)
  const sigCenterX = centerX;
  if (data.authorizedSignature.imageUrl) {
    const sig = await embedImage(doc, data.authorizedSignature.imageUrl);
    if (sig) {
      const sigBox = sig.scaleToFit(P(300), P(170));
      page.drawImage(sig, { x: sigCenterX - sigBox.width / 2, y: bottomY + P(120) - sigBox.height, width: sigBox.width, height: sigBox.height });
    }
  }
  if (data.authorizedSignature.name) {
    drawCenteredText(page, timesBold, data.authorizedSignature.name, P(34), sigCenterX, bottomY + P(40), { color: NAVY });
    drawCenteredText(page, timesItalic, data.authorizedSignature.title || "Authorized Signatory", P(26), sigCenterX, bottomY, { color: MUTED });
  } else {
    drawCenteredText(page, timesItalic, "Authorized Signatory", P(26), sigCenterX, bottomY + P(20), { color: MUTED });
  }

  // Stamp (right)
  if (data.officialStamp.enabled && data.officialStamp.imageUrl) {
    const stamp = await embedImage(doc, data.officialStamp.imageUrl);
    if (stamp) {
      const stampSize = P(230);
      const stampBox = stamp.scaleToFit(stampSize, stampSize);
      page.drawImage(stamp, { x: right - stampBox.width, y: bottomY + P(110) - stampBox.height, width: stampBox.width, height: stampBox.height });
    }
  }

  // ---- Footer ----
  const footerY = P(190);
  const contact = [data.company.address, data.company.website ? `www.${data.company.website.replace(/^https?:\/\//, "")}` : "", data.company.email]
    .filter(Boolean)
    .join("  |  ");
  drawCenteredText(page, helvetica, contact, P(24), centerX, footerY + P(40), { color: MUTED });
  drawCenteredText(page, helvetica, `Issued on ${data.issueDate}  •  MSME: ${data.company.msmeNumber || "—"}`, P(24), centerX, footerY, { color: MUTED });

  return doc.save();
}

export async function generateCertificatePdf(data: CertificatePdfData): Promise<CertificatePdfDocument> {
  const bytes = await buildCertificatePdf(data);
  const fileName = fileNameFor(data.certificateNo);
  const url = `/certificates/generated/${fileName}`;

  // Best-effort local persistence for audit/records.
  try {
    const dir = path.join(process.cwd(), "generated-certificates");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), bytes);
  } catch {
    // Non-fatal: PDF is still returned to the caller.
  }

  return { fileName, mimeType: "application/pdf", sizeBytes: bytes.byteLength, url, data: bytes };
}
