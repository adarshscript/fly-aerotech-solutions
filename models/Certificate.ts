import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { isValidImageUrl } from "@/lib/validators";

export interface ICertificate {
  referenceNo: string;
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  type: "training" | "internship" | "experience";
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  duration: string;
  pdfPath?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function generateReferenceNo(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CER-${year}-${random}`;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    referenceNo: { type: String, required: true, unique: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    type: { type: String, enum: ["training", "internship", "experience"], required: true },
    issueDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
    },
    duration: { type: String, required: true, trim: true },
    pdfPath: {
      type: String,
      validate: { validator: isValidImageUrl, message: "pdfPath must be a valid URL" },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CertificateSchema.pre("save", function (this: HydratedDocument<ICertificate>) {
  if (!this.referenceNo) {
    this.referenceNo = generateReferenceNo();
  }
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "endDate must be on or after startDate");
  }
});

CertificateSchema.index({ referenceNo: 1, isVerified: 1 });

export const Certificate =
  (models.Certificate as import("mongoose").Model<ICertificate>) ??
  model<ICertificate>("Certificate", CertificateSchema);
