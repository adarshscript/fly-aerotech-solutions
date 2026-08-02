import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import {
  Certificate,
  Company,
  Course,
  Student,
  type ICertificate,
  type ICertificateSignature,
  type ICertificateStamp,
} from "@/models";
import { buildQrPayload, saveQrImage } from "@/services/certificates/qr";
import {
  buildCertificatePdfData,
  generateCertificatePdf,
  type CertificatePdfDocument,
} from "@/services/certificates/pdf";

export type CertificateStatus = "draft" | "issued" | "revoked" | "duplicate";

export interface CertificateSignatureView {
  name: string;
  title: string;
  imageUrl?: string;
}

export interface CertificateStampView {
  imageUrl?: string;
  enabled: boolean;
}

export interface CertificateView {
  id: string;
  referenceNo: string;
  certificateNo: string;
  studentId: string;
  studentName: string;
  fatherName?: string;
  motherName?: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  type: string;
  issueDate: string;
  startDate: string;
  endDate: string;
  expiryDate?: string;
  duration: string;
  qrData?: string;
  qrImageUrl?: string;
  logo: string;
  authorizedSignature: CertificateSignatureView;
  officialStamp: CertificateStampView;
  template: string;
  status: CertificateStatus;
  pdfPath?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CertificateCompanyView {
  name: string;
  tagline: string;
  logo: string;
  email: string;
  website: string;
  address: string;
  addressLines: string[];
  msmeNumber: string;
}

type CertificateUpdate = Partial<
  Omit<ICertificate, "createdAt" | "updatedAt" | "certificateNo" | "referenceNo" | "qrCode">
>;

export interface CreateCertificateInput {
  student: string;
  course: string;
  fatherName?: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  type: ICertificate["type"];
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  expiryDate?: Date;
  duration: string;
  template?: ICertificate["template"];
  status?: ICertificate["status"];
  logo?: string;
  authorizedSignature?: Partial<ICertificateSignature>;
  officialStamp?: Partial<ICertificateStamp>;
}

export interface RegisteredCertificateInput {
  studentId: string;
  courseId: string;
  fatherName?: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  type: ICertificate["type"];
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  duration: string;
}

export type CertificateVerificationStatus =
  | "verified"
  | "revoked"
  | "not-found"
  | "expired";

export interface CertificateVerificationResult {
  verified: boolean;
  status: CertificateVerificationStatus;
  reason?: "not-found" | "revoked" | "expired";
  certificate?: {
    certificateNo: string;
    referenceNo: string;
    type: string;
    status: string;
    studentName?: string;
    fatherName?: string;
    courseTitle?: string;
    technology?: string;
    duration: string;
    startDate: Date | null;
    endDate: Date | null;
    issueDate: Date | null;
    expiryDate: Date | null;
    companyName?: string;
  };
}

interface PopulatedCertificate {
  _id: unknown;
  referenceNo: string;
  certificateNo: string;
  student: { _id: unknown; name: string; fatherName?: string; motherName?: string; email?: string; phone?: string } | null;
  course: { _id: unknown; title: string } | null;
  fatherName?: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  type: string;
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  expiryDate?: Date;
  duration: string;
  qrCode?: { data?: string; imageUrl?: string; generatedAt?: Date };
  logo: string;
  authorizedSignature?: CertificateSignatureView;
  officialStamp?: CertificateStampView;
  template: string;
  status: CertificateStatus;
  pdfPath?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function toCertificateView(doc: unknown): CertificateView {
  const d = doc as PopulatedCertificate;
  const student = d.student as
    | { _id?: unknown; name?: string; fatherName?: string; motherName?: string; email?: string; phone?: string }
    | null;
  const course = d.course as { _id?: unknown; title?: string } | null;
  return {
    id: String(d._id),
    referenceNo: d.referenceNo,
    certificateNo: d.certificateNo,
    studentId: student ? String(student._id ?? "") : "",
    studentName: student?.name ?? "",
    fatherName: d.fatherName ?? student?.fatherName,
    motherName: student?.motherName,
    studentEmail: student?.email,
    studentPhone: student?.phone,
    courseId: course ? String(course._id ?? "") : "",
    courseTitle: course?.title ?? "",
    technology: d.technology,
    projectName: d.projectName,
    trainerName: d.trainerName,
    type: d.type,
    issueDate: d.issueDate ? new Date(d.issueDate).toISOString() : "",
    startDate: d.startDate ? new Date(d.startDate).toISOString() : "",
    endDate: d.endDate ? new Date(d.endDate).toISOString() : "",
    expiryDate: d.expiryDate ? new Date(d.expiryDate).toISOString() : undefined,
    duration: d.duration,
    qrData: d.qrCode?.data,
    qrImageUrl: d.qrCode?.imageUrl,
    logo: d.logo,
    authorizedSignature: {
      name: d.authorizedSignature?.name ?? "",
      title: d.authorizedSignature?.title ?? "",
      imageUrl: d.authorizedSignature?.imageUrl,
    },
    officialStamp: {
      enabled: d.officialStamp?.enabled ?? false,
      imageUrl: d.officialStamp?.imageUrl,
    },
    template: d.template,
    status: d.status,
    pdfPath: d.pdfPath,
    isVerified: d.isVerified,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
  };
}

function formatAddress(company: {
  address?: { line1?: string; line2?: string; city?: string; state?: string; pincode?: string; country?: string } | unknown;
}): { address: string; addressLines: string[] } {
  const a = company.address as
    | { line1?: string; line2?: string; city?: string; state?: string; pincode?: string; country?: string }
    | undefined
    | null;
  if (!a) return { address: "", addressLines: [] };
  const lines: string[] = [];
  if (a.line1) lines.push(a.line1);
  if (a.line2) lines.push(a.line2);
  const cityState = [a.city, a.state].filter(Boolean).join(", ");
  if (cityState || a.pincode) lines.push(`${cityState}${a.pincode ? ` - ${a.pincode}` : ""}`);
  if (a.country) lines.push(a.country);
  return { address: lines.join(", "), addressLines: lines };
}

export async function getCertificateCompanyView(): Promise<CertificateCompanyView> {
  await connectToDatabase();
  const company = await Company.findOne({}).lean();
  const addressInfo = formatAddress(company as unknown as { address?: unknown });
  return {
    name: company?.name ?? "Fly Aerotech Solutions",
    tagline: company?.tagline ?? "Building tomorrow's software, today.",
    logo: company?.logo ?? "/logo.jpg",
    email: company?.email ?? "",
    website: company?.website ?? "",
    address: addressInfo.address,
    addressLines: addressInfo.addressLines,
    msmeNumber: company?.msmeNumber ?? "",
  };
}

export async function listCertificates(): Promise<CertificateView[]> {
  await connectToDatabase();
  const docs = await Certificate.find()
    .populate("student", "name fatherName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .lean();
  return docs.map(toCertificateView);
}

export async function getCertificateViewById(id: string): Promise<CertificateView | null> {
  await connectToDatabase();
  const doc = await Certificate.findById(id)
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();
  if (!doc) return null;
  return toCertificateView(doc);
}

function getStudentId(student: unknown): string {
  if (typeof student === "string") return student;
  if (student && typeof student === "object" && "_id" in student) {
    return String((student as { _id: unknown })._id);
  }
  return String(student ?? "");
}

async function buildAndSaveQr(doc: {
  certificateNo: string;
  referenceNo: string;
  student: unknown;
  type: string;
  issueDate: Date;
}) {
  const payload = buildQrPayload({
    certificateNo: doc.certificateNo,
    referenceNo: doc.referenceNo,
    studentId: getStudentId(doc.student),
    type: doc.type,
    issuedOn: doc.issueDate,
  });
  const imageUrl = await saveQrImage(doc.referenceNo, payload);
  return { data: payload, imageUrl, generatedAt: new Date() };
}

export async function createCertificate(input: CreateCertificateInput): Promise<CertificateView> {
  await connectToDatabase();

  const [company, student] = await Promise.all([
    Company.findOne({}).lean(),
    Student.findById(input.student).select("fatherName").lean(),
  ]);

  const logo = input.logo ?? company?.logo ?? "/logo.jpg";
  const fatherName = input.fatherName?.trim() || (student as { fatherName?: string } | null)?.fatherName;

  const doc = await Certificate.create({
    student: input.student,
    course: input.course,
    fatherName,
    technology: input.technology,
    projectName: input.projectName,
    trainerName: input.trainerName,
    type: input.type,
    issueDate: input.issueDate,
    startDate: input.startDate,
    endDate: input.endDate,
    expiryDate: input.expiryDate,
    duration: input.duration,
    template: input.template ?? "classic",
    status: input.status ?? "draft",
    logo,
    authorizedSignature: {
      name: input.authorizedSignature?.name ?? "",
      title: input.authorizedSignature?.title ?? "",
      imageUrl: input.authorizedSignature?.imageUrl,
    },
    officialStamp: {
      enabled: input.officialStamp?.enabled ?? false,
      imageUrl: input.officialStamp?.imageUrl,
    },
    qrCode: { data: "" },
  } as unknown as Parameters<typeof Certificate.create>[0]);

  const qrCode = await buildAndSaveQr(doc);

  const updated = await Certificate.findByIdAndUpdate(
    doc._id,
    { $set: { qrCode } },
    { returnDocument: "after" }
  )
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();

  return toCertificateView(updated);
}

export async function updateCertificate(
  id: string,
  data: CertificateUpdate
): Promise<CertificateView | null> {
  await connectToDatabase();
  const current = await Certificate.findById(id).lean();
  if (!current) return null;

  const qrSensitiveKeys: (keyof CertificateUpdate)[] = ["student", "type", "issueDate"];
  const touchesQr = qrSensitiveKeys.some((key) => key in data);

  const updated = await Certificate.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();
  if (!updated) return null;

  if (touchesQr) {
    const qrCode = await buildAndSaveQr(updated);
    const refreshed = await Certificate.findByIdAndUpdate(id, { $set: { qrCode } }, { returnDocument: "after" })
      .populate("student", "name fatherName")
      .populate("course", "title")
      .lean();
    return toCertificateView(refreshed);
  }

  return toCertificateView(updated);
}

export async function updateCertificateStatus(
  id: string,
  status: ICertificate["status"]
): Promise<CertificateView | null> {
  await connectToDatabase();
  const doc = await Certificate.findByIdAndUpdate(id, { status }, { returnDocument: "after" })
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();
  return doc ? toCertificateView(doc) : null;
}

export async function markVerified(id: string): Promise<CertificateView | null> {
  await connectToDatabase();
  const doc = await Certificate.findByIdAndUpdate(id, { isVerified: true }, { returnDocument: "after" })
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();
  return doc ? toCertificateView(doc) : null;
}

export async function duplicateCertificate(id: string): Promise<CertificateView | null> {
  await connectToDatabase();
  const source = await Certificate.findById(id).lean();
  if (!source) return null;

  const doc = await Certificate.create({
    student: source.student,
    course: source.course,
    fatherName: source.fatherName,
    technology: source.technology,
    type: source.type,
    issueDate: source.issueDate,
    startDate: source.startDate,
    endDate: source.endDate,
    expiryDate: source.expiryDate,
    duration: source.duration,
    template: source.template,
    status: "draft",
    logo: source.logo,
    authorizedSignature: source.authorizedSignature,
    officialStamp: source.officialStamp,
    qrCode: { data: "" },
    isVerified: false,
    pdfPath: undefined,
  } as unknown as Parameters<typeof Certificate.create>[0]);

  const qrCode = await buildAndSaveQr(doc);

  const updated = await Certificate.findByIdAndUpdate(
    doc._id,
    { $set: { qrCode } },
    { returnDocument: "after" }
  )
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();

  return toCertificateView(updated);
}

export async function verifyCertificateByReference(
  reference: string
): Promise<CertificateVerificationResult> {
  await connectToDatabase();
  const doc = await Certificate.findOne({
    $or: [{ referenceNo: reference }, { certificateNo: reference }],
  })
    .populate("student", "name fatherName")
    .populate("course", "title")
    .lean();

  if (!doc) return { verified: false, status: "not-found", reason: "not-found" };
  if (doc.status === "revoked") return { verified: false, status: "revoked", reason: "revoked" };

  const now = new Date();
  const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
  if (expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < now.getTime()) {
    return { verified: false, status: "expired", reason: "expired" };
  }

  const student = doc.student as { name?: string; fatherName?: string } | null;
  const course = doc.course as { title?: string } | null;
  const company = await Company.findOne({}).select("name").lean();

  return {
    verified: true,
    status: "verified",
    certificate: {
      certificateNo: doc.certificateNo,
      referenceNo: doc.referenceNo,
      type: doc.type,
      status: doc.status,
      studentName: student?.name,
      fatherName: doc.fatherName ?? student?.fatherName,
      courseTitle: course?.title,
      technology: doc.technology,
      duration: doc.duration,
      startDate: doc.startDate ?? null,
      endDate: doc.endDate ?? null,
      issueDate: doc.issueDate ?? null,
      expiryDate: expiryDate,
      companyName: company?.name,
    },
  };
}

export async function deleteCertificate(id: string): Promise<CertificateView | null> {
  await connectToDatabase();
  const doc = await Certificate.findByIdAndDelete(id).lean();
  if (!doc) return null;
  return toCertificateView(doc);
}

async function buildPdfForCertificate(doc: {
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
  authorizedSignature?: CertificateSignatureView;
  officialStamp?: CertificateStampView;
  template: string;
  qrCode?: { data?: string; imageUrl?: string };
  student: unknown;
  course: unknown;
}): Promise<CertificatePdfDocument> {
  const [student, course, company] = await Promise.all([
    Student.findById(doc.student as string).select("name fatherName").lean(),
    Course.findById(doc.course as string).select("title").lean(),
    getCertificateCompanyView(),
  ]);

  const pdfData = await buildCertificatePdfData({
    certificate: {
      certificateNo: doc.certificateNo,
      referenceNo: doc.referenceNo,
      type: doc.type,
      duration: doc.duration,
      startDate: doc.startDate,
      endDate: doc.endDate,
      issueDate: doc.issueDate,
      technology: doc.technology,
      fatherName: doc.fatherName,
      logo: doc.logo,
      authorizedSignature: {
        name: doc.authorizedSignature?.name ?? "",
        title: doc.authorizedSignature?.title ?? "",
        imageUrl: doc.authorizedSignature?.imageUrl,
      },
      officialStamp: {
        enabled: doc.officialStamp?.enabled ?? false,
        imageUrl: doc.officialStamp?.imageUrl,
      },
      template: doc.template,
      qrCode: doc.qrCode,
    },
    student: {
      name: (student as { name?: string } | null)?.name ?? "Student",
      fatherName: (student as { fatherName?: string } | null)?.fatherName ?? doc.fatherName,
    },
    course: { title: (course as { title?: string } | null)?.title ?? "Course" },
    company: {
      name: company.name,
      tagline: company.tagline,
      address: company.address,
      email: company.email,
      website: company.website,
      msmeNumber: company.msmeNumber,
    },
  });

  return generateCertificatePdf(pdfData);
}

export async function generateCertificatePdfById(id: string): Promise<CertificatePdfDocument | null> {
  await connectToDatabase();
  const doc = await Certificate.findById(id).lean();
  if (!doc) return null;

  const pdf = await buildPdfForCertificate(doc);

  try {
    await Certificate.findByIdAndUpdate(id, { $set: { pdfPath: pdf.url } });
  } catch {
    // Non-fatal
  }

  return pdf;
}

export async function generateCertificatePdfByReference(
  reference: string
): Promise<CertificatePdfDocument | null> {
  await connectToDatabase();
  const doc = await Certificate.findOne({
    $or: [{ referenceNo: reference }, { certificateNo: reference }],
  }).lean();
  if (!doc) return null;

  if (doc.status === "revoked") return null;
  const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
  if (expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
    return null;
  }

  return buildPdfForCertificate(doc);
}

export async function getPublicCertificateView(reference: string): Promise<CertificateView | null> {
  await connectToDatabase();
  const doc = await Certificate.findOne({
    $or: [{ referenceNo: reference }, { certificateNo: reference }],
  })
    .populate("student", "name fatherName motherName email phone")
    .populate("course", "title")
    .lean();
  if (!doc) return null;

  if (doc.status === "revoked") return null;
  const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
  if (expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
    return null;
  }

  return toCertificateView(doc);
}

export async function createCertificateForRegistration(
  input: RegisteredCertificateInput
): Promise<CertificateView> {
  await connectToDatabase();
  const company = await Company.findOne({}).lean();

  const doc = await Certificate.create({
    student: input.studentId,
    course: input.courseId,
    fatherName: input.fatherName,
    technology: input.technology,
    projectName: input.projectName,
    trainerName: input.trainerName,
    type: input.type,
    issueDate: input.issueDate,
    startDate: input.startDate,
    endDate: input.endDate,
    duration: input.duration,
    template: "classic",
    status: "draft",
    logo: company?.logo ?? "/logo.jpg",
    authorizedSignature: { name: "", title: "", imageUrl: undefined },
    officialStamp: { enabled: false, imageUrl: undefined },
    qrCode: { data: "" },
  } as unknown as Parameters<typeof Certificate.create>[0]);

  const qrCode = await buildAndSaveQr(doc);

  const updated = await Certificate.findByIdAndUpdate(
    doc._id,
    { $set: { qrCode } },
    { returnDocument: "after" }
  )
    .populate("student", "name fatherName motherName email phone")
    .populate("course", "title")
    .lean();

  return toCertificateView(updated);
}
