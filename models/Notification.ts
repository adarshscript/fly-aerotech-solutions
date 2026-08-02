import "server-only";
import { Schema, model, models } from "mongoose";

export interface INotification {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  audience: "all" | "students" | "admins";
  priority: "low" | "normal" | "high";
  isActive: boolean;
  readBy: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    title: { type: String, required: true, trim: true, maxlength: [150, "Title too long"] },
    message: { type: String, required: true, maxlength: [1000, "Message too long"] },
    link: { type: String, trim: true },
    audience: {
      type: String,
      enum: ["all", "students", "admins"],
      default: "all",
      index: true,
    },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    isActive: { type: Boolean, default: true },
    readBy: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

NotificationSchema.index({ createdAt: -1 });

export const Notification =
  (models.Notification as import("mongoose").Model<INotification>) ??
  model<INotification>("Notification", NotificationSchema);
