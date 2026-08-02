import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export interface IEnquiry {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: "general" | "service" | "training" | "internship" | "career";
  status: "new" | "in-progress" | "resolved" | "closed";
  source?: string;
  notes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name is too short"],
      maxlength: [100, "Name is too long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: { validator: isValidEmail, message: "Invalid email address" },
    },
    phone: {
      type: String,
      trim: true,
      validate: { validator: isValidPhone, message: "Invalid phone number" },
    },
    subject: { type: String, required: true, trim: true, maxlength: [200, "Subject too long"] },
    message: {
      type: String,
      required: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [5000, "Message too long"],
    },
    type: {
      type: String,
      enum: ["general", "service", "training", "internship", "career"],
      default: "general",
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
      index: true,
    },
    source: { type: String, trim: true },
    notes: { type: [String], default: [] },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry =
  (models.Enquiry as import("mongoose").Model<IEnquiry>) ?? model<IEnquiry>("Enquiry", EnquirySchema);
