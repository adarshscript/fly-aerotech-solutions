import "server-only";
import type { Model } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { seedSuperAdmin } from "@/services/auth/seed-admin";
import {
  seedBlogs,
  seedCompany,
  seedCourses,
  seedFaqDocs,
  seedGalleryDocs,
  seedHeroSlideDocs,
  seedInternships,
  seedServices,
  seedSettings,
  seedTestimonials,
  seedTraining,
} from "@/lib/seed-data";
import { Blog } from "@/models/Blogs";
import { Company } from "@/models/Company";
import { Course } from "@/models/Course";
import { Faq } from "@/models/FAQ";
import { Gallery } from "@/models/Gallery";
import { HeroSlide } from "@/models/HeroSlide";
import { Internship } from "@/models/Internship";
import { Service } from "@/models/Service";
import { Settings } from "@/models/Settings";
import { Testimonial } from "@/models/Testimonials";
import { Training } from "@/models/Training";

async function upsertAll<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mongoose Model<any> is the documented catch-all
  Model: Model<any>,
  items: T[],
  keyField: string
): Promise<number> {
  let inserted = 0;
  for (const item of items) {
    const record = item as unknown as Record<string, unknown>;
    const filter: Record<string, unknown> = { [keyField]: record[keyField] };
    const result = (await Model.findOneAndUpdate(filter, { $set: record }, { upsert: true, new: true, setDefaultsOnInsert: true })) as {
      isNew?: boolean;
    } | null;
    if (result?.isNew) inserted += 1;
  }
  return inserted;
}

export interface SeedReport {
  [key: string]: number;
}

export async function runSeed(): Promise<SeedReport> {
  await connectToDatabase();

  const report: SeedReport = {
    heroSlides: await upsertAll(HeroSlide, seedHeroSlideDocs, "title"),
    services: await upsertAll(Service, seedServices, "slug"),
    courses: await upsertAll(Course, seedCourses, "slug"),
    training: await upsertAll(Training, seedTraining, "slug"),
    internships: await upsertAll(Internship, seedInternships, "slug"),
    gallery: await upsertAll(Gallery, seedGalleryDocs, "title"),
    testimonials: await upsertAll(Testimonial, seedTestimonials, "name"),
    faqs: await upsertAll(Faq, seedFaqDocs, "question"),
    blogs: await upsertAll(Blog, seedBlogs, "slug"),
    company: await upsertAll(Company, [seedCompany], "name"),
    settings: await upsertAll(Settings, [seedSettings], "siteName"),
  };

  try {
    const superAdmin = await seedSuperAdmin();
    report.admin = superAdmin.created ? 1 : 0;
  } catch (error) {
    console.error("[seed] Skipped super admin:", error instanceof Error ? error.message : error);
  }

  return report;
}
