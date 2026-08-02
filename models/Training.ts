import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { slugify } from "@/lib/slugify";
import { isValidImageUrl } from "@/lib/validators";

export interface ITraining {
  title: string;
  slug: string;
  description: string;
  duration: string;
  mode: "online" | "offline" | "hybrid";
  level: "beginner" | "intermediate" | "advanced";
  seats: number;
  enrolled: number;
  topics: string[];
  startDate?: Date;
  endDate?: Date;
  status: "upcoming" | "running" | "completed";
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TrainingSchema = new Schema<ITraining>(
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
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "online" },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    seats: { type: Number, default: 0, min: [0, "Seats cannot be negative"] },
    enrolled: { type: Number, default: 0, min: [0, "Enrolled cannot be negative"] },
    topics: { type: [String], default: [] },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["upcoming", "running", "completed"], default: "upcoming" },
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

TrainingSchema.pre("validate", function (this: HydratedDocument<ITraining>) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

export const Training =
  (models.Training as import("mongoose").Model<ITraining>) ?? model<ITraining>("Training", TrainingSchema);
