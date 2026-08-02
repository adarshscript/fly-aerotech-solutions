import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidImageUrl } from "@/lib/validators";

export interface ITestimonial {
  name: string;
  designation: string;
  company?: string;
  avatar?: string;
  rating: number;
  text: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, minlength: [2, "Name is too short"] },
    designation: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    avatar: {
      type: String,
      validate: { validator: isValidImageUrl, message: "avatar must be a valid URL" },
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    text: { type: String, required: true, minlength: [10, "Testimonial too short"] },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
  },
  { timestamps: true }
);

TestimonialSchema.index({ order: 1 });

export const Testimonial =
  (models.Testimonial as import("mongoose").Model<ITestimonial>) ??
  model<ITestimonial>("Testimonial", TestimonialSchema);
