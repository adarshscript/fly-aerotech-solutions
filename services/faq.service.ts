import { connectToDatabase } from "@/lib/mongodb";
import { Faq, type IFaq } from "@/models";

type FaqInput = Omit<IFaq, "createdAt" | "updatedAt">;
type FaqUpdate = Partial<FaqInput>;

export async function listActiveFaqs(): Promise<IFaq[]> {
  await connectToDatabase();
  return Faq.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getAllFaqs(): Promise<IFaq[]> {
  await connectToDatabase();
  return Faq.find().sort({ order: 1 }).lean();
}

export async function createFaq(data: FaqInput): Promise<IFaq> {
  await connectToDatabase();
  return Faq.create(data);
}

export async function updateFaq(id: string, data: FaqUpdate): Promise<IFaq | null> {
  await connectToDatabase();
  return Faq.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteFaq(id: string): Promise<IFaq | null> {
  await connectToDatabase();
  return Faq.findByIdAndDelete(id).lean();
}
