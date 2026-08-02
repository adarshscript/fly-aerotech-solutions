import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { isValidEmail, isValidPhone } from "@/lib/validators";

export interface IStudent {
  name: string;
  email: string;
  phone: string;
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

StudentSchema.pre("save", function (this: HydratedDocument<IStudent>) {
  if (!this.referenceNo) {
    this.referenceNo = generateReferenceNo();
  }
});

export const Student =
  (models.Student as import("mongoose").Model<IStudent>) ?? model<IStudent>("Student", StudentSchema);
