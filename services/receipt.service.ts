import "server-only";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type Color,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;

const NAVY = rgb(0.043, 0.153, 0.29);
const GOLD = rgb(0.72, 0.53, 0.12);
const DARK = rgb(0.13, 0.17, 0.22);
const MUTED = rgb(0.42, 0.46, 0.52);
const LINE = rgb(0.85, 0.87, 0.9);
const WARN_BG = rgb(0.99, 0.96, 0.88);
const WARN_BORDER = rgb(0.82, 0.6, 0.1);
const WARN_TEXT = rgb(0.5, 0.36, 0.05);

export interface ReceiptStudentData {
  name: string;
  fatherName?: string;
  email: string;
  phone: string;
  courseTitle: string;
  technology?: string;
  certificateType: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  issueDate: Date;
  certificateNo: string;
  referenceNo: string;
}

export interface ReceiptCompanyData {
  name: string;
  tagline?: string;
  email: string;
  phone?: string;
  website: string;
  addressLines: string[];
  msmeNumber: string;
}

export interface ReceiptData {
  company: ReceiptCompanyData;
  student: ReceiptStudentData;
}

function formatDate(value: Date): string {
  if (Number.isNaN(value.getTime())) return "—";
  return value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function drawCenteredText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  size: number,
  centerX: number,
  y: number,
  color: Color
): number {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: centerX - width / 2, y, size, font, color });
  return width;
}

export async function generateRegistrationReceipt(data: ReceiptData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Registration Receipt");
  doc.setProducer("Fly Aerotech Solutions Certificate Engine");

  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const times = await doc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  let y = PAGE_HEIGHT - MARGIN;

  // Header
  page.drawText(data.company.name, { x: MARGIN, y: y - 10, size: 22, font: helveticaBold, color: NAVY });
  y -= 18;
  if (data.company.tagline) {
    page.drawText(data.company.tagline, { x: MARGIN, y: y, size: 9, font: times, color: MUTED });
    y -= 16;
  }
  const addressLine = data.company.addressLines.join(", ");
  const companyMeta = [addressLine, data.company.email, data.company.phone, data.company.website]
    .filter(Boolean)
    .join("   |   ");
  if (companyMeta) {
    page.drawText(companyMeta, { x: MARGIN, y: y, size: 8, font: helvetica, color: MUTED });
    y -= 10;
  }
  if (data.company.msmeNumber) {
    page.drawText(`MSME No: ${data.company.msmeNumber}`, { x: MARGIN, y: y, size: 8, font: helvetica, color: MUTED });
    y -= 14;
  }

  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1.2, color: GOLD });
  y -= 34;

  // Title
  drawCenteredText(page, timesBold, "REGISTRATION RECEIPT", 20, PAGE_WIDTH / 2, y, DARK);
  y -= 12;
  drawCenteredText(page, helvetica, `Issued on ${formatDate(data.student.issueDate)}`, 9, PAGE_WIDTH / 2, y, MUTED);
  y -= 34;

  // Receipt summary
  const rightX = PAGE_WIDTH - MARGIN;
  const leftX = MARGIN;

  const summary = [
    ["Receipt / Reference No", data.student.referenceNo],
    ["Certificate No", data.student.certificateNo],
  ];
  for (const [label, value] of summary) {
    page.drawText(`${label}:`, { x: leftX, y, size: 9, font: helveticaBold, color: NAVY });
    const valueWidth = helveticaBold.widthOfTextAtSize(value, 9);
    page.drawText(value, { x: rightX - valueWidth, y, size: 9, font: helveticaBold, color: NAVY });
    y -= 16;
  }
  y -= 14;

  // Divider
  page.drawLine({ start: { x: leftX, y }, end: { x: rightX, y }, thickness: 0.8, color: LINE });
  y -= 24;

  // Student section
  page.drawText("STUDENT DETAILS", { x: leftX, y, size: 10, font: helveticaBold, color: GOLD });
  y -= 22;

  const rows: [string, string][] = [
    ["Full Name", data.student.name],
    ["Father's Name", data.student.fatherName || "—"],
    ["Email", data.student.email],
    ["Mobile", data.student.phone],
  ];
  for (const [label, value] of rows) {
    page.drawText(label, { x: leftX, y, size: 9, font: helvetica, color: MUTED });
    page.drawText(value, { x: leftX + 140, y, size: 9, font: helveticaBold, color: DARK });
    y -= 18;
  }
  y -= 12;

  page.drawLine({ start: { x: leftX, y }, end: { x: rightX, y }, thickness: 0.8, color: LINE });
  y -= 24;

  // Training section
  page.drawText("TRAINING DETAILS", { x: leftX, y, size: 10, font: helveticaBold, color: GOLD });
  y -= 22;

  const trainingRows: [string, string][] = [
    ["Certificate Type", data.student.certificateType],
    ["Course", data.student.courseTitle],
    ["Technology", data.student.technology || "—"],
    ["Duration", data.student.duration],
    ["Start Date", formatDate(data.student.startDate)],
    ["End Date", formatDate(data.student.endDate)],
  ];
  for (const [label, value] of trainingRows) {
    page.drawText(label, { x: leftX, y, size: 9, font: helvetica, color: MUTED });
    page.drawText(value, { x: leftX + 140, y, size: 9, font: helveticaBold, color: DARK });
    y -= 18;
  }
  y -= 16;

  // Warning box
  const warnBoxTop = y;
  const warnBoxHeight = 62;
  page.drawRectangle({
    x: leftX,
    y: warnBoxTop - warnBoxHeight,
    width: rightX - leftX,
    height: warnBoxHeight,
    color: WARN_BG,
    borderColor: WARN_BORDER,
    borderWidth: 1,
  });
  page.drawText("IMPORTANT", { x: leftX + 14, y: warnBoxTop - 20, size: 9, font: helveticaBold, color: WARN_TEXT });
  const warnLine1 = "Please save your Reference Number.";
  const warnLine2 = "Without it you cannot verify your certificate.";
  page.drawText(warnLine1, { x: leftX + 14, y: warnBoxTop - 36, size: 9, font: helvetica, color: WARN_TEXT });
  page.drawText(warnLine2, { x: leftX + 14, y: warnBoxTop - 50, size: 9, font: helveticaBold, color: WARN_TEXT });
  y = warnBoxTop - warnBoxHeight - 20;

  // Footer
  page.drawLine({ start: { x: leftX, y }, end: { x: rightX, y }, thickness: 0.8, color: LINE });
  y -= 20;
  page.drawText(
    "This is a system-generated receipt from Fly Aerotech Solutions. It does not require a signature.",
    { x: leftX, y, size: 8, font: times, color: MUTED }
  );
  y -= 12;
  drawCenteredText(page, helvetica, "Scan the QR code on your certificate to verify it online.", 8, PAGE_WIDTH / 2, y, MUTED);

  return doc.save();
}
