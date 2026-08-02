import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidEmail } from "@/lib/validators";

export interface IAdmin {
  name: string;
  email: string;
  passwordHash: string;
  role: "superadmin" | "admin" | "staff" | "viewer";
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name is too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: { validator: isValidEmail, message: "Invalid email address" },
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
      minlength: [8, "Password hash is too short"],
    },
    role: { type: String, enum: ["superadmin", "admin", "staff", "viewer"], default: "viewer" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const Admin =
  (models.Admin as import("mongoose").Model<IAdmin>) ?? model<IAdmin>("Admin", AdminSchema);
