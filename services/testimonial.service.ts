import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial, type ITestimonial } from "@/models";

type TestimonialInput = Omit<ITestimonial, "createdAt" | "updatedAt">;
type TestimonialUpdate = Partial<TestimonialInput>;

export async function listActiveTestimonials(): Promise<ITestimonial[]> {
  await connectToDatabase();
  return Testimonial.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getAllTestimonials(): Promise<ITestimonial[]> {
  await connectToDatabase();
  return Testimonial.find().sort({ order: 1 }).lean();
}

export async function createTestimonial(data: TestimonialInput): Promise<ITestimonial> {
  await connectToDatabase();
  return Testimonial.create(data);
}

export async function updateTestimonial(id: string, data: TestimonialUpdate): Promise<ITestimonial | null> {
  await connectToDatabase();
  return Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteTestimonial(id: string): Promise<ITestimonial | null> {
  await connectToDatabase();
  return Testimonial.findByIdAndDelete(id).lean();
}
