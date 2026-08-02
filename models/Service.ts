import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { slugify } from "@/lib/slugify";
import { isValidImageUrl } from "@/lib/validators";

export interface IService {
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  description: string;
  features: string[];
  image?: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
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
    icon: { type: String, required: true, trim: true },
    shortDescription: {
      type: String,
      required: true,
      minlength: [10, "Short description must be at least 10 characters"],
    },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    image: {
      type: String,
      validate: {
        validator: isValidImageUrl,
        message: "image must be a valid URL",
      },
    },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
    isActive: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.pre("validate", function (this: HydratedDocument<IService>) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

ServiceSchema.index({ order: 1 });

export const Service =
  (models.Service as import("mongoose").Model<IService>) ?? model<IService>("Service", ServiceSchema);
