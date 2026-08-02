import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidImageUrl } from "@/lib/validators";

export interface IGallery {
  title: string;
  category: "campus" | "training" | "events" | "projects";
  imageUrl: string;
  description?: string;
  uploadedBy: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true, minlength: [2, "Title is too short"] },
    category: {
      type: String,
      enum: ["campus", "training", "events", "projects"],
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: { validator: isValidImageUrl, message: "imageUrl must be a valid URL" },
    },
    description: { type: String, trim: true },
    uploadedBy: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
  },
  { timestamps: true }
);

GallerySchema.index({ order: 1 });

export const Gallery =
  (models.Gallery as import("mongoose").Model<IGallery>) ?? model<IGallery>("Gallery", GallerySchema);
