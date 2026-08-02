import "server-only";
import {
  galleryItems,
  internshipRoles,
  services,
  trainingPrograms,
} from "@/lib/data";
import { images } from "@/lib/images";
import { connectToDatabase } from "@/lib/mongodb";
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
import type {
  BlogItem,
  CompanyInfo,
  FaqItem,
  GalleryItem,
  HeroSlideItem,
  InternshipRole,
  ServiceItem,
  SettingsInfo,
  TestimonialItem,
  TrainingProgram,
} from "@/types";

function isDbAvailable() {
  return Boolean(process.env.MONGODB_URI);
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Service.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return services;
    return docs.map((doc) => ({
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
      image: doc.image ?? images.services[0],
      slug: doc.slug,
    }));
  } catch {
    return services;
  }
}

export async function getCourses() {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Course.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    if (docs.length === 0) return trainingPrograms;
    return docs.map((doc) => ({
      ...doc,
      topics: doc.curriculum,
      image: doc.coverImage ?? images.courses[0],
    }));
  } catch {
    return trainingPrograms;
  }
}

export async function getTrainingPrograms(): Promise<TrainingProgram[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Training.find({ status: { $ne: "completed" } })
      .sort({ createdAt: 1 })
      .lean();
    if (docs.length === 0) return trainingPrograms;
    return docs.map((doc) => ({
      title: doc.title,
      duration: doc.duration,
      mode: (doc.mode.charAt(0).toUpperCase() + doc.mode.slice(1)) as TrainingProgram["mode"],
      level: (doc.level.charAt(0).toUpperCase() + doc.level.slice(1)) as TrainingProgram["level"],
      description: doc.description,
      topics: doc.topics,
      image: doc.coverImage ?? images.training,
      slug: doc.slug,
    }));
  } catch {
    return trainingPrograms;
  }
}

export async function getInternshipRoles(): Promise<InternshipRole[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Internship.find({ isActive: true, status: "open" })
      .sort({ createdAt: 1 })
      .lean();
    if (docs.length === 0) return internshipRoles;
    return docs.map((doc) => ({
      title: doc.title,
      domain: doc.domain,
      mode: doc.mode.charAt(0).toUpperCase() + doc.mode.slice(1),
      description: doc.description,
      skills: doc.skills,
      image: doc.image ?? images.courses[0],
      slug: doc.slug,
    }));
  } catch {
    return internshipRoles;
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Gallery.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return galleryItems;
    return docs.map((doc) => ({
      title: doc.title,
      category: doc.category,
      image: doc.imageUrl,
      description: doc.description,
    }));
  } catch {
    return galleryItems;
  }
}

export async function getHeroSlides(): Promise<HeroSlideItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return [];
    return docs.map((doc) => ({
      title: doc.title,
      subtitle: doc.subtitle,
      image: doc.image,
      badge: doc.badge,
      ctaLabel: doc.ctaLabel,
      ctaHref: doc.ctaHref,
    }));
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Testimonial.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return [];
    return docs.map((doc) => ({
      name: doc.name,
      designation: doc.designation,
      company: doc.company,
      quote: doc.text,
      rating: doc.rating,
      avatar: doc.avatar,
    }));
  } catch {
    return [];
  }
}

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Faq.find({ isActive: true }).sort({ order: 1 }).lean();
    if (docs.length === 0) return [];
    return docs.map((doc) => ({
      question: doc.question,
      answer: doc.answer,
      category: doc.category,
    }));
  } catch {
    return [];
  }
}

export async function getBlogs(): Promise<BlogItem[]> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const docs = await Blog.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
    if (docs.length === 0) return [];
    return docs.map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      coverImage: doc.coverImage,
      author: doc.author,
      category: doc.category,
      tags: doc.tags,
      publishedAt: doc.publishedAt?.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getCompany(): Promise<CompanyInfo | null> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const doc = await Company.findOne().lean();
    if (!doc) return null;
    const address = doc.address;
    return {
      name: doc.name,
      tagline: doc.tagline,
      logo: doc.logo,
      favicon: doc.favicon,
      email: doc.email,
      phone: doc.phone,
      website: doc.website,
      location: [address?.city, address?.state, address?.country]
        .filter(Boolean)
        .join(", "),
      city: address?.city ?? "",
      addressLine: [address?.line1, address?.line2].filter(Boolean).join(", "),
      msme: doc.msmeNumber,
      udyam: doc.udyamNumber,
      establishedYear: doc.establishedYear,
      workingHours: doc.workingHours,
      social: {
        github: doc.socialLinks?.github ?? undefined,
        linkedin: doc.socialLinks?.linkedin ?? undefined,
        twitter: doc.socialLinks?.twitter ?? undefined,
        instagram: doc.socialLinks?.instagram ?? undefined,
        facebook: doc.socialLinks?.facebook ?? undefined,
        youtube: doc.socialLinks?.youtube ?? undefined,
      },
      copyright: doc.copyright,
      footerAbout: doc.footer?.about ?? "",
      footerQuickLinks: doc.footer?.quickLinks ?? [],
      seo: {
        title: doc.seo?.title ?? "",
        description: doc.seo?.description ?? "",
        keywords: doc.seo?.keywords ?? [],
      },
      mapEmbedUrl: doc.mapEmbedUrl ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<SettingsInfo | null> {
  try {
    if (!isDbAvailable()) throw new Error("no db");
    await connectToDatabase();
    const doc = await Settings.findOne().lean();
    if (!doc) return null;
    return {
      siteName: doc.siteName,
      tagline: doc.tagline,
      announcement: doc.announcement
        ? { enabled: doc.announcement.enabled, message: doc.announcement.message }
        : undefined,
      maintenanceMode: doc.maintenanceMode
        ? { enabled: doc.maintenanceMode.enabled, message: doc.maintenanceMode.message }
        : undefined,
      studentRegistrationEnabled: doc.studentRegistrationEnabled,
      defaultCurrency: doc.defaultCurrency,
    };
  } catch {
    return null;
  }
}
