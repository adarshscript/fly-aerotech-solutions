import { galleryItems, internshipRoles, services, trainingPrograms } from "@/lib/data";
import { images } from "@/lib/images";
import type { FaqItem, GalleryItem, HeroSlideItem } from "@/types";

const slugFromTitle = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const seedHeroSlides: HeroSlideItem[] = [
  {
    badge: "Vadodara, Gujarat",
    title: "Software, Training & Internships Under One Roof",
    subtitle:
      "Fly Aerotech Solutions helps students and professionals build careers with hands-on training, real-world internships and industry-grade software development.",
    image: images.heroSlides[0],
    ctaLabel: "Explore Training",
    ctaHref: "/training",
  },
  {
    badge: "Build Real Projects",
    title: "Learn by Building, Not Just Watching",
    subtitle:
      "Our training and internship programs are project-driven so you graduate with a portfolio that speaks for you.",
    image: images.heroSlides[1],
    ctaLabel: "View Internships",
    ctaHref: "/internship",
  },
  {
    badge: "Certified Programs",
    title: "Recognised Certificates for Every Program",
    subtitle:
      "Every completed training and internship comes with a verifiable certificate you can share with employers.",
    image: images.heroSlides[2],
    ctaLabel: "Verify Certificate",
    ctaHref: "/certificate-verify",
  },
];

export const seedHeroSlideDocs = seedHeroSlides.map((slide, i) => ({
  ...slide,
  order: i + 1,
  isActive: true,
}));

export const seedServices = services.map((service, i) => ({
  ...service,
  shortDescription: service.description,
  features: [],
  image: images.services[i % images.services.length],
  order: i + 1,
  isActive: true,
  showOnHome: i < 6,
}));

const courseCategories: Array<"web" | "software" | "programming" | "data" | "cloud" | "research"> = [
  "web",
  "software",
  "programming",
  "web",
  "data",
  "cloud",
];

export const seedCourses = trainingPrograms.map((program, i) => ({
  title: program.title,
  slug: program.slug ?? slugFromTitle(program.title),
  description: program.description,
  duration: program.duration,
  category: courseCategories[i % courseCategories.length],
  fee: 0,
  curriculum: program.topics,
  coverImage: i % 2 === 0 ? images.courses[0] : images.courses[1],
  isActive: true,
}));

export const seedTraining = trainingPrograms.map((program, i) => ({
  title: program.title,
  slug: program.slug ?? slugFromTitle(program.title),
  description: program.description,
  topics: program.topics,
  duration: program.duration,
  mode: program.mode.toLowerCase() as "online" | "offline" | "hybrid",
  level: program.level.toLowerCase() as "beginner" | "intermediate" | "advanced",
  coverImage: i % 2 === 0 ? images.courses[0] : images.courses[1],
  seats: 25,
  enrolled: 0,
  status: "upcoming" as const,
}));

export const seedInternships = internshipRoles.map((role, i) => ({
  title: role.title,
  slug: role.slug ?? slugFromTitle(role.title),
  domain: role.domain,
  mode: role.mode.toLowerCase().replace("on-site", "onsite") as "onsite" | "remote" | "hybrid",
  duration: "3 Months",
  seats: 4,
  description: role.description,
  skills: role.skills,
  image: role.image ?? images.services[i % images.services.length],
  status: "open" as const,
  isActive: true,
}));

export const seedGallery: GalleryItem[] = galleryItems.map((item) => ({
  title: item.title,
  category: item.category,
  image: item.image,
  description: "",
}));

export const seedGalleryDocs = seedGallery.map((item, i) => ({
  title: item.title,
  category: item.category,
  imageUrl: images.gallery[i % images.gallery.length],
  description: "",
  uploadedBy: "Fly Aerotech Solutions",
  isActive: true,
  order: i + 1,
}));

export const seedTestimonials = [
  {
    name: "Anjali Sharma",
    designation: "Web Development Trainee",
    company: "Batch 2025",
    text: "The project-driven approach made all the difference. I went from basics to deploying a real full-stack app in eight weeks.",
    rating: 5,
    avatar: images.team[0],
    isActive: true,
    order: 1,
  },
  {
    name: "Rahul Patel",
    designation: "Software Development Intern",
    company: "Fly Aerotech Solutions",
    text: "I got to work on live features with a senior engineering team. The mentorship here is genuinely one-on-one.",
    rating: 5,
    avatar: images.team[0],
    isActive: true,
    order: 2,
  },
  {
    name: "Sneha Mehta",
    designation: "R&D Intern",
    company: "Fly Aerotech Solutions",
    text: "Perfect place to explore emerging tech. I contributed to internal R&D and walked away with a verifiable certificate.",
    rating: 5,
    avatar: images.team[0],
    isActive: true,
    order: 3,
  },
];

export const seedFaqs: FaqItem[] = [
  {
    question: "Who can join the training programs?",
    answer:
      "Students, fresh graduates and working professionals. Programs are offered at beginner, intermediate and advanced levels, so there is something for everyone.",
    category: "training",
  },
  {
    question: "Are internships paid or unpaid?",
    answer:
      "Our internships are primarily skill-building opportunities focused on real project experience, with certificates issued on successful completion.",
    category: "internship",
  },
  {
    question: "Are certificates verifiable?",
    answer:
      "Yes. Every issued certificate carries a unique reference number that can be verified on this website's certificate verification page.",
    category: "certificate",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "We work with modern stacks including JavaScript, TypeScript, React, Next.js, Node.js, databases and cloud platforms.",
    category: "general",
  },
  {
    question: "Do you provide placement support?",
    answer:
      "We help candidates strengthen their portfolio and interview readiness through real projects, resume guidance and mock interviews.",
    category: "training",
  },
  {
    question: "How do I contact the team?",
    answer:
      "Use the contact form on the Contact page or email us at the address listed in the footer. We usually respond within one working day.",
    category: "general",
  },
];

export const seedFaqDocs = seedFaqs.map((faq, i) => ({
  ...faq,
  order: i + 1,
  isActive: true,
}));

export const seedBlogs = [
  {
    title: "Why Project-Based Learning Beats Passive Courses",
    slug: "project-based-learning-vs-passive-courses",
    excerpt:
      "Real projects build the skills, confidence and portfolio that interviews actually test. Here is how we design training around projects.",
    content:
      "Passive lectures help you recognise concepts; building real projects helps you apply them. This post explains the project-driven method behind our training programs and why it produces job-ready engineers.",
    coverImage: images.courses[0],
    author: "Fly Aerotech Solutions",
    category: "Learning",
    tags: ["training", "learning"],
    status: "published" as const,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    views: 0,
  },
  {
    title: "What to Expect From a Software Development Internship",
    slug: "what-to-expect-from-software-internship",
    excerpt:
      "From your first commit to your final review, here is the day-to-day of interning with an engineering team.",
    content:
      "Interns at Fly Aerotech Solutions work on real modules, pair with senior engineers, participate in code reviews and present their work at the end of the program.",
    coverImage: images.courses[1],
    author: "Fly Aerotech Solutions",
    category: "Internship",
    tags: ["internship", "careers"],
    status: "published" as const,
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    views: 0,
  },
  {
    title: "How to Verify Your Fly Aerotech Certificate",
    slug: "how-to-verify-your-certificate",
    excerpt:
      "Every certificate carries a unique reference number. Verify it in seconds on our certificate verification page.",
    content:
      "Use the certificate verification page, enter your reference number and instantly confirm the authenticity of your training or internship certificate.",
    coverImage: images.courses[0],
    author: "Fly Aerotech Solutions",
    category: "Announcements",
    tags: ["certificate", "announcement"],
    status: "published" as const,
    publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    views: 0,
  },
];

export const seedCompany = {
  name: "Fly Aerotech Solutions",
  tagline: "Software Development · Training · Internships",
  logo: images.logo,
  favicon: images.favicon,
  email: "contact@flyaerotechsolutions.com",
  phone: "+91 98765 43210",
  website: "https://flyaerotechsolutions.com",
  address: {
    line1: "Vadodara, Gujarat, India",
    city: "Vadodara",
    state: "Gujarat",
    pincode: "390001",
    country: "India",
  },
  msmeNumber: "UDYAM-GJ-00-0000000",
  establishedYear: 2021,
  workingHours: "Mon – Sat: 10:00 AM – 7:00 PM IST",
  socialLinks: {
    github: "https://github.com/flyaerotech",
    linkedin: "https://linkedin.com/company/flyaerotech",
    twitter: "https://twitter.com/flyaerotech",
    instagram: "https://instagram.com/flyaerotech",
    facebook: "https://facebook.com/flyaerotech",
    youtube: "https://youtube.com/@flyaerotech",
  },
  copyright: `© ${new Date().getFullYear()} Fly Aerotech Solutions. All rights reserved.`,
  footer: {
    about:
      "Fly Aerotech Solutions provides software development, training and internships from Vadodara, Gujarat.",
    quickLinks: [],
  },
};

export const seedSettings = {
  siteName: "Fly Aerotech Solutions",
  tagline: "Software Development · Training · Internships",
  announcement: {
    enabled: false,
    message: "",
  },
  maintenanceMode: {
    enabled: false,
    message: "",
  },
  studentRegistrationEnabled: true,
  defaultCurrency: "INR",
};
