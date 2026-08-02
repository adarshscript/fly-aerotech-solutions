import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog, Certificate, Course, Enquiry, Internship, Service, Student, Training } from "@/models";

export interface RecentEnquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: Date | null;
}

export interface DashboardStats {
  students: number;
  courses: number;
  trainingPrograms: number;
  internships: number;
  services: number;
  enquiries: number;
  unreadEnquiries: number;
  certificates: number;
  blogs: number;
  recentEnquiries: RecentEnquiry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectToDatabase();

  const [
    students,
    courses,
    trainingPrograms,
    internships,
    services,
    enquiries,
    unreadEnquiries,
    certificates,
    blogs,
  ] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    Training.countDocuments(),
    Internship.countDocuments(),
    Service.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Certificate.countDocuments(),
    Blog.countDocuments(),
  ]);

  const recentDocs = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean();

  return {
    students,
    courses,
    trainingPrograms,
    internships,
    services,
    enquiries,
    unreadEnquiries,
    certificates,
    blogs,
    recentEnquiries: recentDocs.map((doc) => ({
      id: String(doc._id),
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      status: doc.status,
      createdAt: doc.createdAt ?? null,
    })),
  };
}
