import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export interface IContact {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "replied" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactSchema = new Schema<IContact>(
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
      trim: true,
      lowercase: true,
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
    },
    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

ContactSchema.index({ status: 1, createdAt: -1 });

export const Contact =
  (models.Contact as import("mongoose").Model<IContact>) ?? model<IContact>("Contact", ContactSchema);
