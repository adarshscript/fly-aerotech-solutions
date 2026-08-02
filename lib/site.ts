export const site = {
  name: "Fly Aerotech Solutions",
  tagline: "Building tomorrow's software, today.",
  location: "Vadodara, Gujarat, India",
  city: "Vadodara",
  website: "flyaerotechsolutions.com",
  email: "flyaerotechsolutions@gmail.com",
  msme: "UDYAM-GJ-24-0181066",
  establishedYear: 2024,
  social: {
    github: "#",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
  },
} as const;

export const businessActivities = [
  "Computer Programming",
  "Web Development",
  "Software Development",
  "Software Support",
  "Research & Development",
  "Scientific & Technical Services",
  "Training",
  "Internship",
  "Technology Consulting",
] as const;

export type BusinessActivity = (typeof businessActivities)[number];
