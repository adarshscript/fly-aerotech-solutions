import { connectToDatabase } from "@/lib/mongodb";
import { Internship, type IInternship } from "@/models";

type InternshipInput = Omit<IInternship, "createdAt" | "updatedAt">;
type InternshipUpdate = Partial<InternshipInput>;

export async function listOpenInternships(): Promise<IInternship[]> {
  await connectToDatabase();
  return Internship.find({ status: "open", isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function listActiveInternships(): Promise<IInternship[]> {
  await connectToDatabase();
  return Internship.find({ isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function getInternshipBySlug(slug: string): Promise<IInternship | null> {
  await connectToDatabase();
  return Internship.findOne({ slug, isActive: true }).lean();
}

export async function createInternship(data: InternshipInput): Promise<IInternship> {
  await connectToDatabase();
  return Internship.create(data);
}

export async function updateInternship(id: string, data: InternshipUpdate): Promise<IInternship | null> {
  await connectToDatabase();
  return Internship.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteInternship(id: string): Promise<IInternship | null> {
  await connectToDatabase();
  return Internship.findByIdAndDelete(id).lean();
}
