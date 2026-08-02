import "server-only";
import { Schema, model, models } from "mongoose";

export interface ISettingsAnnouncement {
  enabled: boolean;
  message: string;
}

export interface ISettingsMaintenance {
  enabled: boolean;
  message: string;
}

export interface ISettings {
  siteName: string;
  tagline: string;
  announcement: ISettingsAnnouncement;
  maintenanceMode: ISettingsMaintenance;
  studentRegistrationEnabled: boolean;
  defaultCurrency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnnouncementSchema = new Schema<ISettingsAnnouncement>(
  {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: "", maxlength: [200, "Announcement too long"] },
  },
  { _id: false }
);

const MaintenanceSchema = new Schema<ISettingsMaintenance>(
  {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: "" },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    announcement: { type: AnnouncementSchema, default: () => ({ enabled: false, message: "" }) },
    maintenanceMode: { type: MaintenanceSchema, default: () => ({ enabled: false, message: "" }) },
    studentRegistrationEnabled: { type: Boolean, default: true },
    defaultCurrency: { type: String, default: "INR", trim: true },
  },
  { timestamps: true }
);

export const Settings =
  (models.Settings as import("mongoose").Model<ISettings>) ?? model<ISettings>("Settings", SettingsSchema);
