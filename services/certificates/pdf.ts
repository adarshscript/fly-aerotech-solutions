import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, degrees, type Color, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import { generateQrPngBuffer, buildVerificationUrl, type CertificateQrPayload } from "@/services/certificates/qr";
import { CERTIFICATE_LOCATION } from "@/components/certificates/preview-types";

// A4 Landscape in PDF points
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

const NAVY = rgb(0.043, 0.173, 0.388); // #0B2C63
const GREEN = rgb(0.078, 0.722, 0.416); // #14B86A
const CREAM = rgb(0.988, 0.988, 0.976); // #FCFCF9
const LIGHT_GRAY = rgb(0.965, 0.973, 0.984); // #F6F8FB
const BORDER = rgb(0.867, 0.898, 0.937); // #DDE5EF
const DARK = rgb(0.122, 0.161, 0.216); // #1F2937
const MUTED = rgb(0.392, 0.455, 0.557); // #64748B
const FAINT = rgb(0.91, 0.93, 0.96); // subtle circuit decoration

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

function spacedWidth(font: PDFFont, text: string, size: number, letterSpacing: number): number {
  let width = 0;
  for (const char of text) {
    width += font.widthOfTextAtSize(char, size);
  }
  return width + letterSpacing * Math.max(0, text.length - 1);
}

function drawCenteredTextSpaced(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  centerX: number,
  y: number,
  letterSpacing: number,
  options: { color?: Color } = {}
) {
  const width = spacedWidth(font, text, size, letterSpacing);
  let cursor = centerX - width / 2;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color: options.color ?? DARK });
    cursor += font.widthOfTextAtSize(char, size) + letterSpacing;
  }
  return width;
}

function drawRightTextSpaced(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  rightX: number,
  y: number,
  letterSpacing: number,
  options: { color?: Color } = {}
) {
  const width = spacedWidth(font, text, size, letterSpacing);
  let cursor = rightX - width;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color: options.color ?? DARK });
    cursor += font.widthOfTextAtSize(char, size) + letterSpacing;
  }
  return width;
}

function drawLeftTextSpaced(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  x: number,
  y: number,
  letterSpacing: number,
  options: { color?: Color } = {}
) {
  let cursor = x;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color: options.color ?? DARK });
    cursor += font.widthOfTextAtSize(char, size) + letterSpacing;
  }
  return cursor - letterSpacing;
}

function drawWrappedCentered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  centerX: number,
  y: number,
  maxWidth: number,
  options: { color?: Color; lineHeight?: number } = {}
): number {
  const lines = wrapText(font, text, size, maxWidth);
  const lineHeight = options.lineHeight ?? size * 1.4;
  let cursor = y;
  for (const line of lines) {
    drawCenteredText(page, font, line, size, centerX, cursor, { color: options.color });
    cursor -= lineHeight;
  }
  return cursor;
}

function drawRightText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  rightX: number,
  y: number,
  options: { color?: Color } = {}
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: rightX - width,
    y,
    size,
    font,
    color: options.color ?? DARK,
  });
  return width;
}

function drawAccentDivider(page: PDFPage, centerX: number, y: number, halfWidth: number) {
  page.drawLine({ start: { x: centerX - halfWidth, y }, end: { x: centerX - 9, y }, thickness: 1.4, color: NAVY });
  page.drawLine({ start: { x: centerX + 9, y }, end: { x: centerX + halfWidth, y }, thickness: 1.4, color: NAVY });
  page.drawRectangle({ x: centerX - 4, y: y - 4, width: 8, height: 8, color: GREEN, rotate: degrees(45) });
}

function drawCornerCircuit(page: PDFPage, x: number, y: number) {
  page.drawLine({ start: { x, y }, end: { x: x + 46, y }, thickness: 1, color: FAINT });
  page.drawLine({ start: { x: x + 46, y }, end: { x: x + 46, y: y + 26 }, thickness: 1, color: FAINT });
  page.drawLine({ start: { x: x + 46, y: y + 26 }, end: { x: x + 72, y: y + 26 }, thickness: 1, color: FAINT });
  page.drawEllipse({ x: x + 80, y: y + 30, xScale: 2.4, yScale: 2.4, color: FAINT });
  page.drawLine({ start: { x: x + 96, y: y + 64 }, end: { x: x + 66, y: y + 64 }, thickness: 1, color: FAINT });
  page.drawLine({ start: { x: x + 66, y: y + 64 }, end: { x: x + 66, y: y + 40 }, thickness: 1, color: FAINT });
  page.drawRectangle({ x: x + 54, y: y + 50, width: 8, height: 8, color: FAINT });
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

  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const W = PAGE_WIDTH;
  const H = PAGE_HEIGHT;
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const outerMargin = 22;
  const innerMargin = 34;

  // ---- Premium paper background (very light off-white) ----
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });

  // ---- Double border ----
  page.drawRectangle({
    x: outerMargin,
    y: outerMargin,
    width: W - outerMargin * 2,
    height: H - outerMargin * 2,
    borderColor: NAVY,
    borderWidth: 2.5,
  });
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: W - innerMargin * 2,
    height: H - innerMargin * 2,
    borderColor: GREEN,
    borderWidth: 1,
  });

  // ---- Geometric corner accents (green diamonds at inner corners) ----
  const corner = 8;
  page.drawRectangle({ x: innerMargin - 4, y: innerMargin - 4, width: corner, height: corner, color: GREEN, rotate: degrees(45) });
  page.drawRectangle({ x: W - innerMargin - 4 - corner, y: innerMargin - 4, width: corner, height: corner, color: GREEN, rotate: degrees(45) });
  page.drawRectangle({ x: innerMargin - 4, y: H - innerMargin - 4 - corner, width: corner, height: corner, color: GREEN, rotate: degrees(45) });
  page.drawRectangle({ x: W - innerMargin - 4 - corner, y: H - innerMargin - 4 - corner, width: corner, height: corner, color: GREEN, rotate: degrees(45) });

  // ---- Subtle circuit decorations (very light) ----
  drawCornerCircuit(page, 56, 56);
  drawCornerCircuit(page, W - 172, H - 130);
  drawCornerCircuit(page, 120, H - 96);

  const centerX = W / 2;

  // ---- Header: logo (left) ----
  const logo = await embedImage(doc, data.logo);
  if (logo) {
    const logoBox = logo.scaleToFit(76, 76);
    const logoX = 52;
    const logoY = H - 50 - logoBox.height;
    page.drawRectangle({
      x: logoX - 10,
      y: logoY - 10,
      width: logoBox.width + 20,
      height: logoBox.height + 20,
      borderColor: BORDER,
      borderWidth: 1,
      color: LIGHT_GRAY,
    });
    page.drawImage(logo, { x: logoX, y: logoY, width: logoBox.width, height: logoBox.height });
  }

  // ---- Header: company name + subtitle (center) ----
  drawCenteredTextSpaced(page, helveticaBold, data.company.name.toUpperCase(), 24, centerX, H - 66, 2.2, {
    color: NAVY,
  });
  drawCenteredTextSpaced(page, helveticaBold, "SOFTWARE DEVELOPMENT", 8, centerX, H - 90, 4, {
    color: GREEN,
  });

  // ---- Header: company info (right) ----
  const rightX = W - 52;
  const address = CERTIFICATE_LOCATION;
  const website = data.company.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const infoLines = [address, website, data.company.email, data.company.msmeNumber ? `MSME: ${data.company.msmeNumber}` : ""].filter(Boolean);
  let infoY = H - 50;
  for (const line of infoLines) {
    const width = drawRightText(page, helvetica, line, 8.5, rightX, infoY, { color: DARK });
    page.drawEllipse({ x: rightX - width - 7, y: infoY + 3, xScale: 1.7, yScale: 1.7, color: GREEN });
    infoY -= 13.5;
  }

  // ---- Header divider ----
  drawAccentDivider(page, centerX, H - 142, 120);

  // ---- Metadata: reference (left) + date (right) ----
  drawLeftTextSpaced(page, helveticaBold, "CERTIFICATE REF. NO.", 6.5, 52, H - 162, 1.6, { color: NAVY });
  page.drawText(data.referenceNo || "FAS/2026/EXP-000000", { x: 52, y: H - 176, size: 9.5, font: helveticaBold, color: DARK });
  drawRightTextSpaced(page, helveticaBold, "DATE OF ISSUE", 6.5, rightX, H - 162, 1.6, { color: NAVY });
  const dateValueWidth = helveticaBold.widthOfTextAtSize(data.issueDate || "—", 9.5);
  page.drawText(data.issueDate || "—", { x: rightX - dateValueWidth, y: H - 176, size: 9.5, font: helveticaBold, color: DARK });

  // ---- Title ----
  const title = `CERTIFICATE OF ${data.type.toUpperCase()} COMPLETION`;
  drawCenteredTextSpaced(page, helveticaBold, title, 26, centerX, H - 214, 1.4, { color: NAVY });
  drawCenteredTextSpaced(page, helveticaBold, "TO WHOMSOEVER IT MAY CONCERN", 7, centerX, H - 232, 3.4, {
    color: MUTED,
  });

  // ---- Body ----
  const bodyMaxWidth = W - 460;
  let y = H - 250;
  drawCenteredText(page, helvetica, "This is to certify that", 9.5, centerX, y, { color: DARK });
  y -= 16;
  drawCenteredText(page, helveticaBold, data.studentName.toUpperCase(), 22, centerX, y, { color: GREEN });
  y -= 30;
  if (data.fatherName) {
    drawCenteredText(page, helveticaOblique, `S/o ${data.fatherName}`, 8.5, centerX, y, { color: MUTED });
    y -= 14;
  }
  y = drawWrappedCentered(
    page,
    helvetica,
    `has successfully completed the professional ${data.type.toLowerCase()} program in`,
    9.5,
    centerX,
    y,
    bodyMaxWidth,
    { color: DARK }
  );
  y -= 4;
  y = drawWrappedCentered(page, helveticaBold, data.courseTitle, 13.5, centerX, y, bodyMaxWidth, {
    color: GREEN,
  });
  y -= 4;
  if (data.technology) {
    y = drawWrappedCentered(
      page,
      helvetica,
      `with specialization in ${data.technology}`,
      9.5,
      centerX,
      y,
      bodyMaxWidth,
      { color: DARK }
    );
    y -= 4;
  }
  y = drawWrappedCentered(
    page,
    helvetica,
    `during the period ${data.startDate} to ${data.endDate}, spanning a duration of ${data.duration}.`,
    9.5,
    centerX,
    y,
    bodyMaxWidth,
    { color: DARK }
  );
  y -= 6;
  y = drawWrappedCentered(
    page,
    helvetica,
    `During the program, ${data.studentName || "the candidate"} demonstrated commendable dedication, technical aptitude and professional conduct.`,
    8.5,
    centerX,
    y,
    bodyMaxWidth,
    { color: MUTED }
  );
  y = drawWrappedCentered(
    page,
    helvetica,
    "We congratulate them on this achievement and wish them continued success.",
    8.5,
    centerX,
    y,
    bodyMaxWidth,
    { color: MUTED }
  );

  // ---- Bottom: QR (left) / official stamp (center) / signature (right) ----
  const labelY = 64;
  const imgBottom = 84;

  // QR (left)
  const qrSize = 70;
  const qrLeft = 52;
  const qrCenterX = qrLeft + qrSize / 2;
  let qr = null;
  if (data.qrImageUrl && data.qrImageUrl !== "/certificate/qr-placeholder.svg") {
    qr = await embedImage(doc, data.qrImageUrl);
  }
  if (!qr) {
    const qrBuffer = await generateQrPngBuffer(data.qrData ?? data.referenceNo, { width: 512, margin: 2 });
    qr = await doc.embedPng(qrBuffer);
  }
  if (qr) {
    page.drawRectangle({
      x: qrLeft - 7,
      y: imgBottom - 7,
      width: qrSize + 14,
      height: qrSize + 14,
      borderColor: BORDER,
      borderWidth: 1,
    });
    page.drawImage(qr, { x: qrLeft, y: imgBottom, width: qrSize, height: qrSize });
    drawCenteredTextSpaced(page, helveticaBold, "SCAN TO VERIFY", 6.5, qrCenterX, labelY, 2, {
      color: NAVY,
    });
  }

  // Official company stamp (center)
  const stampImage = await embedImage(doc, data.officialStamp.imageUrl ?? "/assets/stamp.png");
  if (stampImage) {
    const stampBox = stampImage.scaleToFit(92, 92);
    page.drawImage(stampImage, { x: centerX - stampBox.width / 2, y: imgBottom, width: stampBox.width, height: stampBox.height });
  }
  drawCenteredTextSpaced(page, helveticaBold, "OFFICIAL COMPANY STAMP", 6.5, centerX, labelY, 1.6, {
    color: MUTED,
  });

  // Signature (right)
  const sigRight = rightX;
  if (data.authorizedSignature.imageUrl) {
    const sig = await embedImage(doc, data.authorizedSignature.imageUrl);
    if (sig) {
      const sigBox = sig.scaleToFit(150, 40);
      page.drawImage(sig, { x: sigRight - sigBox.width, y: imgBottom, width: sigBox.width, height: sigBox.height });
    }
  }
  drawRightTextSpaced(page, helveticaBold, "AUTHORIZED SIGNATORY", 6.5, sigRight, labelY, 1.6, {
    color: NAVY,
  });
  const sigNameWidth = helvetica.widthOfTextAtSize(data.company.name, 6.5);
  page.drawText(data.company.name, { x: sigRight - sigNameWidth, y: labelY - 12, size: 6.5, font: helvetica, color: MUTED });

  // ---- Footer ----
  page.drawLine({ start: { x: 52, y: 46 }, end: { x: W - 52, y: 46 }, thickness: 0.8, color: BORDER });
  const footer1 = [data.company.name.toUpperCase(), address, website].filter(Boolean).join("  •  ");
  drawCenteredText(page, helvetica, footer1, 7, centerX, 34, { color: MUTED });
  drawCenteredText(page, helvetica, `Certificate verification: ${buildVerificationUrl(data.referenceNo)}`, 7, centerX, 24, {
    color: MUTED,
  });

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
