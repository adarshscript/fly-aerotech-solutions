import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { isValidImageUrl } from "@/lib/validators";
import { Counter } from "@/models/Counter";

export interface ICertificateQr {
  data: string;
  imageUrl?: string;
  generatedAt?: Date;
}

export interface ICertificateSignature {
  name: string;
  title: string;
  imageUrl?: string;
}

export interface ICertificateStamp {
  imageUrl?: string;
  enabled: boolean;
}

export interface ICertificate {
  referenceNo: string;
  certificateNo: string;
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  fatherName?: string;
  technology?: string;
  projectName?: string;
  trainerName?: string;
  type: "training" | "internship" | "experience" | "appreciation";
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  expiryDate?: Date;
  duration: string;
  qrCode: ICertificateQr;
  logo: string;
  authorizedSignature: ICertificateSignature;
  officialStamp: ICertificateStamp;
  template: "classic" | "modern" | "minimal";
  status: "draft" | "issued" | "revoked" | "duplicate";
  pdfPath?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

async function nextSequence(prefix: string): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { name: `${prefix}-${year}` },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return `${prefix}-${year}-${String(counter?.value ?? 1).padStart(6, "0")}`;
}

async function generateCertificateNumbers(): Promise<{ referenceNo: string; certificateNo: string }> {
  const [referenceNo, certificateNo] = await Promise.all([
    nextSequence("CER"),
    nextSequence("FLY"),
  ]);
  return { referenceNo, certificateNo };
}

const CertificateQrSchema = new Schema<ICertificateQr>(
  {
    data: { type: String, default: "" },
    imageUrl: {
      type: String,
      validate: { validator: isValidImageUrl, message: "qr imageUrl must be a valid URL" },
    },
    generatedAt: { type: Date },
  },
  { _id: false }
);

const CertificateSignatureSchema = new Schema<ICertificateSignature>(
  {
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    imageUrl: {
      type: String,
      validate: { validator: isValidImageUrl, message: "signature imageUrl must be a valid URL" },
    },
  },
  { _id: false }
);

const CertificateStampSchema = new Schema<ICertificateStamp>(
  {
    imageUrl: {
      type: String,
      validate: { validator: isValidImageUrl, message: "stamp imageUrl must be a valid URL" },
    },
    enabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const CertificateSchema = new Schema<ICertificate>(
  {
    referenceNo: { type: String, required: true, unique: true, index: true },
    certificateNo: { type: String, required: true, unique: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    fatherName: { type: String, trim: true, maxlength: [100, "Father's name is too long"] },
    technology: { type: String, trim: true },
    projectName: { type: String, trim: true, maxlength: [200, "Project name is too long"] },
    trainerName: { type: String, trim: true, maxlength: [100, "Trainer name is too long"] },
    type: {
      type: String,
      enum: ["training", "internship", "experience", "appreciation"],
      required: true,
    },
    issueDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    expiryDate: { type: Date },
    duration: { type: String, required: true, trim: true },
    qrCode: { type: CertificateQrSchema, default: () => ({ data: "" }) },
    logo: { type: String, required: true },
    authorizedSignature: { type: CertificateSignatureSchema, default: () => ({ name: "", title: "" }) },
    officialStamp: { type: CertificateStampSchema, default: () => ({ enabled: false }) },
    template: { type: String, enum: ["classic", "modern", "minimal"], default: "classic" },
    status: { type: String, enum: ["draft", "issued", "revoked", "duplicate"], default: "draft" },
    pdfPath: {
      type: String,
      validate: { validator: isValidImageUrl, message: "pdfPath must be a valid URL" },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CertificateSchema.pre("validate", async function (this: HydratedDocument<ICertificate>) {
  if (!this.referenceNo || !this.certificateNo) {
    const numbers = await generateCertificateNumbers();
    this.referenceNo = this.referenceNo || numbers.referenceNo;
    this.certificateNo = this.certificateNo || numbers.certificateNo;
  }
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "endDate must be on or after startDate");
  }
});

CertificateSchema.index({ referenceNo: 1, certificateNo: 1, isVerified: 1 });
CertificateSchema.index({ status: 1, createdAt: -1 });

export const Certificate =
  (models.Certificate as import("mongoose").Model<ICertificate>) ??
  model<ICertificate>("Certificate", CertificateSchema);
