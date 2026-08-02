import type { CareerRole, CompanyStats, GalleryItem, InternshipRole, NavItem, ServiceItem, TrainingProgram } from "@/types";

export const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Training", href: "/training" },
  { label: "Internship", href: "/internship" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const utilityLinks: NavItem[] = [
  { label: "Student", href: "/student" },
  { label: "Verify", href: "/certificate-verify" },
  { label: "Login", href: "/admin-login" },
];

export const services: ServiceItem[] = [
  {
    title: "Computer Programming",
    description: "Robust, efficient and scalable program development for web, desktop and enterprise platforms.",
    icon: "code",
    slug: "computer-programming",
    image: "/service1.jpg",
  },
  {
    title: "Web Development",
    description: "Modern, responsive websites and web applications engineered with the latest frameworks.",
    icon: "globe",
    slug: "web-development",
    image: "/service2.jpg",
  },
  {
    title: "Software Development",
    description: "End-to-end custom software design, development, testing and deployment.",
    icon: "layers",
    slug: "software-development",
    image: "/service3.jpg",
  },
  {
    title: "Software Support",
    description: "Reliable maintenance, monitoring and technical support that keeps your software running smoothly.",
    icon: "life-buoy",
    slug: "software-support",
    image: "/service1.jpg",
  },
  {
    title: "Research & Development",
    description: "Applied R&D across emerging technologies to turn concepts into working prototypes.",
    icon: "flask",
    slug: "research-development",
    image: "/service2.jpg",
  },
  {
    title: "Scientific & Technical Services",
    description: "Technical consultation and execution services for scientific and engineering domains.",
    icon: "microscope",
    slug: "scientific-technical-services",
    image: "/service3.jpg",
  },
  {
    title: "Training",
    description: "Hands-on, industry-aligned training programs for students and working professionals.",
    icon: "graduation-cap",
    slug: "training",
    image: "/course1.jpg",
  },
  {
    title: "Internship",
    description: "Real-world internship opportunities that build practical skills and industry confidence.",
    icon: "briefcase",
    slug: "internship",
    image: "/course2.jpg",
  },
  {
    title: "Technology Consulting",
    description: "Strategic technology guidance for digital transformation and architecture decisions.",
    icon: "lightbulb",
    slug: "technology-consulting",
    image: "/service1.jpg",
  },
];

export const trainingPrograms: TrainingProgram[] = [
  {
    title: "Full-Stack Web Development",
    duration: "8 Weeks",
    mode: "Hybrid",
    level: "Intermediate",
    description: "Build complete web applications from frontend to backend using React, Next.js and Node.js.",
    topics: ["HTML, CSS & JavaScript", "React & Next.js", "REST APIs & Databases", "Deployment"],
    slug: "full-stack-web-development",
    image: "/course1.jpg",
  },
  {
    title: "Software Development Fundamentals",
    duration: "6 Weeks",
    mode: "Offline",
    level: "Beginner",
    description: "Core computer science and engineering principles for aspiring software developers.",
    topics: ["Programming Logic", "Version Control", "Testing Basics", "Software Lifecycle"],
    slug: "software-development-fundamentals",
    image: "/course2.jpg",
  },
  {
    title: "Python Programming",
    duration: "6 Weeks",
    mode: "Hybrid",
    level: "Beginner",
    description: "Practical Python for automation, data handling, and application development.",
    topics: ["Python Basics", "Data Structures", "APIs & Automation", "Mini Projects"],
    slug: "python-programming",
    image: "/course1.jpg",
  },
  {
    title: "Web Development with React & Next.js",
    duration: "8 Weeks",
    mode: "Online",
    level: "Intermediate",
    description: "Modern component-driven web development with React and the Next.js framework.",
    topics: ["Components & State", "Routing & Layouts", "Server Components", "Optimization"],
    slug: "web-development-with-react-nextjs",
    image: "/course2.jpg",
  },
  {
    title: "Data Structures & Algorithms",
    duration: "7 Weeks",
    mode: "Hybrid",
    level: "Intermediate",
    description: "Strong foundations in DSA to crack technical interviews and write efficient code.",
    topics: ["Arrays & Strings", "Linked Lists & Trees", "Graphs & Search", "Problem Solving"],
    slug: "data-structures-algorithms",
    image: "/course1.jpg",
  },
  {
    title: "Cloud & DevOps Fundamentals",
    duration: "5 Weeks",
    mode: "Online",
    level: "Advanced",
    description: "Deploy, scale and monitor applications using cloud and DevOps practices.",
    topics: ["Linux Basics", "Docker & CI/CD", "Cloud Platforms", "Monitoring"],
    slug: "cloud-devops-fundamentals",
    image: "/course2.jpg",
  },
];

export const internshipRoles: InternshipRole[] = [
  {
    title: "Software Development Intern",
    domain: "Software",
    mode: "Hybrid",
    description: "Work on real software modules, write clean code and ship features with the engineering team.",
    skills: ["JavaScript / TypeScript", "Data Structures", "Git"],
    slug: "software-development-intern",
    image: "/course1.jpg",
  },
  {
    title: "Web Development Intern",
    domain: "Web",
    mode: "Hybrid",
    description: "Build responsive, production-grade interfaces and integrate them with backend services.",
    skills: ["React / Next.js", "Tailwind CSS", "REST APIs"],
    slug: "web-development-intern",
    image: "/course2.jpg",
  },
  {
    title: "Research & Development Intern",
    domain: "R&D",
    mode: "On-site",
    description: "Explore emerging technologies, prototype solutions and contribute to internal R&D projects.",
    skills: ["Analytical Thinking", "Python", "Documentation"],
    slug: "research-development-intern",
    image: "/service3.jpg",
  },
  {
    title: "Software Support Intern",
    domain: "Support",
    mode: "Remote",
    description: "Learn to diagnose, reproduce and resolve software issues while working with support workflows.",
    skills: ["Troubleshooting", "SQL Basics", "Communication"],
    slug: "software-support-intern",
    image: "/service1.jpg",
  },
];

export const careerRoles: CareerRole[] = [
  {
    title: "Software Engineer (Junior)",
    type: "Full-time",
    location: "Vadodara, Gujarat",
    description: "Develop and maintain software applications across our product and client engagements.",
  },
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Vadodara, Gujarat",
    description: "Craft polished, accessible and performant user interfaces for web applications.",
  },
  {
    title: "Full-Stack Developer",
    type: "Full-time",
    location: "Vadodara, Gujarat",
    description: "Own features end-to-end across frontend, backend, databases and deployment.",
  },
  {
    title: "Training Coordinator",
    type: "Full-time",
    location: "Vadodara, Gujarat",
    description: "Plan, schedule and deliver our training and internship programs.",
  },
];

export const galleryItems: GalleryItem[] = [
  { title: "Work Culture", category: "campus", image: "/gallery1.jpg" },
  { title: "Training Sessions", category: "training", image: "/gallery2.jpg" },
  { title: "Development Sprints", category: "projects", image: "/gallery3.jpg" },
  { title: "Team Collaboration", category: "events", image: "/gallery1.jpg" },
  { title: "Coding Workshops", category: "training", image: "/gallery2.jpg" },
  { title: "Intern Onboarding", category: "events", image: "/gallery3.jpg" },
];

export const stats: CompanyStats[] = [
  { value: "09+", label: "Service Domains" },
  { value: "3", label: "Certificate Types" },
  { value: "1:1", label: "Mentorship" },
  { value: "100%", label: "Real Projects" },
];
