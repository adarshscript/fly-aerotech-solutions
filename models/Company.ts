import "server-only";
import { Schema, model, models } from "mongoose";
import { isValidEmail, isValidImageUrl } from "@/lib/validators";

export interface ICompanyAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ICompanySocialLinks {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  github?: string;
}

export interface ICompanyFooterLink {
  label: string;
  href: string;
}

export interface ICompanyFooter {
  about: string;
  quickLinks: ICompanyFooterLink[];
}

export interface ICompany {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  website: string;
  address: ICompanyAddress;
  msmeNumber: string;
  establishedYear: number;
  workingHours?: string;
  socialLinks: ICompanySocialLinks;
  copyright: string;
  footer: ICompanyFooter;
  mapEmbedUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanyAddressSchema = new Schema<ICompanyAddress>(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4,10}$/, "Invalid pincode"],
    },
    country: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CompanySocialLinksSchema = new Schema<ICompanySocialLinks>(
  {
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    github: { type: String, trim: true },
  },
  { _id: false }
);

const CompanyFooterSchema = new Schema<ICompanyFooter>(
  {
    about: { type: String, required: true },
    quickLinks: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          href: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
    },
    tagline: { type: String, required: true, trim: true },
    logo: {
      type: String,
      required: true,
      validate: { validator: isValidImageUrl, message: "logo must be a valid URL" },
    },
    favicon: {
      type: String,
      required: true,
      validate: { validator: isValidImageUrl, message: "favicon must be a valid URL" },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: { validator: isValidEmail, message: "Invalid company email" },
    },
    phone: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    address: { type: CompanyAddressSchema, required: true },
    msmeNumber: { type: String, required: true, trim: true },
    establishedYear: {
      type: Number,
      required: true,
      min: [1900, "Invalid year"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    workingHours: { type: String, trim: true },
    socialLinks: { type: CompanySocialLinksSchema, default: () => ({}) },
    copyright: { type: String, required: true, trim: true },
    footer: { type: CompanyFooterSchema, required: true },
    mapEmbedUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Company =
  (models.Company as import("mongoose").Model<ICompany>) ?? model<ICompany>("Company", CompanySchema);
