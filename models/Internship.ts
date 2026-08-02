import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { slugify } from "@/lib/slugify";
import { isValidImageUrl } from "@/lib/validators";

export interface IInternship {
  title: string;
  slug: string;
  domain: string;
  mode: "onsite" | "hybrid" | "remote";
  duration: string;
  seats: number;
  stipend?: string;
  description: string;
  skills: string[];
  eligibility?: string;
  image?: string;
  status: "open" | "upcoming" | "closed";
  deadline?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title must be under 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug contains invalid characters"],
    },
    domain: { type: String, required: true, trim: true },
    mode: { type: String, enum: ["onsite", "hybrid", "remote"], default: "hybrid" },
    duration: { type: String, required: true, trim: true },
    seats: { type: Number, default: 1, min: [1, "Seats must be at least 1"] },
    stipend: { type: String, trim: true },
    description: {
      type: String,
      required: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    skills: { type: [String], default: [] },
    eligibility: { type: String, trim: true },
    image: {
      type: String,
      validate: {
        validator: isValidImageUrl,
        message: "image must be a valid URL",
      },
    },
    status: { type: String, enum: ["open", "upcoming", "closed"], default: "open", index: true },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InternshipSchema.pre("validate", function (this: HydratedDocument<IInternship>) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const Internship =
  (models.Internship as import("mongoose").Model<IInternship>) ??
  model<IInternship>("Internship", InternshipSchema);
