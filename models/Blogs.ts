import "server-only";
import { Schema, model, models, type HydratedDocument } from "mongoose";
import { slugify } from "@/lib/slugify";
import { isValidImageUrl } from "@/lib/validators";

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: Date;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title must be under 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug contains invalid characters"],
    },
    excerpt: { type: String, required: true, maxlength: [300, "Excerpt too long"] },
    content: { type: String, required: true },
    coverImage: {
      type: String,
      validate: { validator: isValidImageUrl, message: "coverImage must be a valid URL" },
    },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date },
    views: { type: Number, default: 0, min: [0, "Views cannot be negative"] },
  },
  { timestamps: true }
);

BlogSchema.pre("validate", function (this: HydratedDocument<IBlog>) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export const Blog =
  (models.Blog as import("mongoose").Model<IBlog>) ?? model<IBlog>("Blog", BlogSchema);
