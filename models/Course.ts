import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { slugify } from "@/lib/slugify";
import { isValidImageUrl } from "@/lib/validators";

export interface ICourse {
  title: string;
  slug: string;
  description: string;
  duration: string;
  category: "web" | "software" | "programming" | "data" | "cloud" | "research";
  fee: number;
  curriculum: string[];
  isActive: boolean;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CourseSchema = new Schema<ICourse>(
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
    description: {
      type: String,
      required: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    duration: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["web", "software", "programming", "data", "cloud", "research"],
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
      min: [0, "Fee cannot be negative"],
    },
    curriculum: {
      type: [String],
      default: [],
      validate: {
        validator: (topics: string[]) => topics.length <= 20,
        message: "Curriculum cannot exceed 20 topics",
      },
    },
    isActive: { type: Boolean, default: true },
    coverImage: {
      type: String,
      validate: {
        validator: isValidImageUrl,
        message: "coverImage must be a valid URL",
      },
    },
  },
  { timestamps: true }
);

CourseSchema.pre("validate", function (this: HydratedDocument<ICourse>) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const Course =
  (models.Course as import("mongoose").Model<ICourse>) ?? model<ICourse>("Course", CourseSchema);
