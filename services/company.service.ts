import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { Company, type ICompany } from "@/models";
import { isValidEmail, isValidImageUrl, isValidPhone } from "@/lib/validators";

export interface CompanySettingsInput {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  website: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  msmeNumber: string;
  udyamNumber: string;
  establishedYear: number;
  workingHours?: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    github?: string;
  };
  copyright: string;
  footer: {
    about: string;
    quickLinks: { label: string; href: string }[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  mapEmbedUrl?: string;
}

export type CompanySettingsResult =
  | { ok: true; company: ICompany }
  | { ok: false; error: string };

function cleanUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export async function getCompanySettings(): Promise<ICompany | null> {
  await connectToDatabase();
  return Company.findOne({}).sort({ createdAt: 1 }).lean();
}

export async function updateCompanySettings(
  input: CompanySettingsInput
): Promise<CompanySettingsResult> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const phone = input.phone?.trim() ?? "";
  const logo = input.logo?.trim() ?? "";
  const favicon = input.favicon?.trim() ?? "";
  const pincode = input.address?.pincode?.trim() ?? "";
  const year = Number(input.establishedYear);

  if (name.length < 2) return { ok: false, error: "Company name must be at least 2 characters." };
  if (!isValidEmail(email)) return { ok: false, error: "Enter a valid company email address." };
  if (!isValidPhone(phone)) return { ok: false, error: "Enter a valid phone number." };
  if (!isValidImageUrl(logo)) return { ok: false, error: "Logo must be an absolute or root-relative URL." };
  if (!isValidImageUrl(favicon)) return { ok: false, error: "Favicon must be an absolute or root-relative URL." };
  if (!/^\d{4,10}$/.test(pincode)) return { ok: false, error: "Enter a valid PIN code (4–10 digits)." };
  if (Number.isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    return { ok: false, error: "Established year is invalid." };
  }
  if (!input.udyamNumber?.trim()) return { ok: false, error: "UDYAM registration number is required." };

  const data: Omit<ICompany, "createdAt" | "updatedAt"> = {
    name,
    tagline: input.tagline?.trim() || name,
    logo,
    favicon,
    email,
    phone,
    website: input.website?.trim() ?? "",
    address: {
      line1: input.address?.line1?.trim() ?? "",
      line2: input.address?.line2?.trim() || undefined,
      city: input.address?.city?.trim() ?? "",
      state: input.address?.state?.trim() ?? "",
      pincode,
      country: input.address?.country?.trim() ?? "",
    },
    msmeNumber: input.msmeNumber?.trim() ?? "",
    udyamNumber: input.udyamNumber.trim(),
    establishedYear: year,
    workingHours: input.workingHours?.trim() || undefined,
    socialLinks: {
      linkedin: cleanUrl(input.socialLinks?.linkedin),
      instagram: cleanUrl(input.socialLinks?.instagram),
      twitter: cleanUrl(input.socialLinks?.twitter),
      facebook: cleanUrl(input.socialLinks?.facebook),
      youtube: cleanUrl(input.socialLinks?.youtube),
      github: cleanUrl(input.socialLinks?.github),
    },
    copyright: input.copyright?.trim() || `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    footer: {
      about: input.footer?.about?.trim() ?? "",
      quickLinks: (input.footer?.quickLinks ?? [])
        .map((link) => ({
          label: link.label?.trim() ?? "",
          href: link.href?.trim() ?? "",
        }))
        .filter((link) => link.label && link.href),
    },
    seo: {
      title: input.seo?.title?.trim() ?? "",
      description: input.seo?.description?.trim() ?? "",
      keywords: (input.seo?.keywords ?? []).map((keyword) => keyword.trim()).filter(Boolean),
    },
    mapEmbedUrl: cleanUrl(input.mapEmbedUrl),
  };

  await connectToDatabase();
  const company = await Company.findOneAndUpdate({}, { $set: data }, {
    upsert: true,
    new: true,
    runValidators: true,
  }).lean();

  return { ok: true, company };
}
