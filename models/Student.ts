import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export interface IStudent {
  name: string;
  fatherName?: string;
  motherName?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  course: Schema.Types.ObjectId;
  enrollmentDate: Date;
  status: "active" | "completed" | "dropped" | "pending";
  referenceNo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function generateReferenceNo(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FAS-${year}-${random}`;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name is too short"],
      maxlength: [100, "Name is too long"],
    },
    fatherName: {
      type: String,
      trim: true,
      maxlength: [100, "Father's name is too long"],
    },
    motherName: {
      type: String,
      trim: true,
      maxlength: [100, "Mother's name is too long"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value: Date) => value.getTime() <= Date.now(),
        message: "Date of birth cannot be in the future",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: { validator: isValidEmail, message: "Invalid email address" },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isValidPhone, message: "Invalid phone number" },
    },
    address: { type: String, trim: true, maxlength: [300, "Address is too long"] },
    city: { type: String, trim: true, maxlength: [100, "City name is too long"] },
    state: { type: String, trim: true, maxlength: [100, "State name is too long"] },
    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, "Pincode must be a valid 6-digit code"],
    },
    photo: { type: String, maxlength: [2_000_000, "Photo file is too large"] },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "pending"],
      default: "pending",
      index: true,
    },
    referenceNo: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 1, email: 1, phone: 1, city: 1 });
StudentSchema.index({ status: 1, createdAt: -1 });

StudentSchema.pre("save", function (this: HydratedDocument<IStudent>) {
  if (!this.referenceNo) {
    this.referenceNo = generateReferenceNo();
  }
});

export const Student =
  (models.Student as import("mongoose").Model<IStudent>) ?? model<IStudent>("Student", StudentSchema);
