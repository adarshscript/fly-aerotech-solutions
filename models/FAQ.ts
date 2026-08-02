import "server-only";
import { Schema, model, models } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true, minlength: [5, "Question too short"] },
    answer: { type: String, required: true, minlength: [5, "Answer too short"] },
    category: { type: String, trim: true },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FaqSchema.index({ order: 1 });

export const Faq =
  (models.Faq as import("mongoose").Model<IFaq>) ?? model<IFaq>("Faq", FaqSchema);
