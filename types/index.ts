export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
  slug?: string;
}

export interface TrainingProgram {
  title: string;
  duration: string;
  mode: "Online" | "Offline" | "Hybrid";
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  topics: string[];
  image?: string;
  slug?: string;
}

export interface InternshipRole {
  title: string;
  domain: string;
  mode: string;
  description: string;
  skills: string[];
  image?: string;
  slug?: string;
}

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
  description?: string;
}

export interface CareerRole {
  title: string;
  type: string;
  location: string;
  description: string;
}

export interface CompanyStats {
  label: string;
  value: string;
}

export interface HeroSlideItem {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface TestimonialItem {
  name: string;
  designation: string;
  company?: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface BlogItem {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  city: string;
  addressLine: string;
  msme: string;
  udyam: string;
  establishedYear: number;
  workingHours?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  copyright: string;
  footerAbout: string;
  footerQuickLinks: { label: string; href: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  mapEmbedUrl?: string;
}

export interface SettingsInfo {
  siteName: string;
  tagline: string;
  announcement?: { enabled: boolean; message: string };
  maintenanceMode?: { enabled: boolean; message: string };
  studentRegistrationEnabled: boolean;
  defaultCurrency: string;
}
