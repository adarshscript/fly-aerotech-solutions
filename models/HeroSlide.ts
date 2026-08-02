import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidImageUrl } from "@/lib/validators";

export interface IHeroSlide {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    image: {
      type: String,
      required: true,
      validate: { validator: isValidImageUrl, message: "image must be a valid URL" },
    },
    badge: { type: String, trim: true },
    ctaLabel: { type: String, default: "Get Started", trim: true },
    ctaHref: { type: String, default: "/contact", trim: true },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HeroSlideSchema.index({ order: 1 });

export const HeroSlide =
  (models.HeroSlide as import("mongoose").Model<IHeroSlide>) ?? model<IHeroSlide>("HeroSlide", HeroSlideSchema);
