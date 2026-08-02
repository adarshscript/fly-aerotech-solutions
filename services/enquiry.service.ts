import { connectToDatabase } from "@/lib/mongodb";
import { Enquiry, type IEnquiry } from "@/models";

type EnquiryInput = Omit<IEnquiry, "createdAt" | "updatedAt">;
type EnquiryUpdate = Partial<EnquiryInput>;

export async function createEnquiry(data: EnquiryInput): Promise<IEnquiry> {
  await connectToDatabase();
  return Enquiry.create(data);
}

export async function listEnquiries(): Promise<IEnquiry[]> {
  await connectToDatabase();
  return Enquiry.find().sort({ createdAt: -1 }).lean();
}

export async function getEnquiryById(id: string): Promise<IEnquiry | null> {
  await connectToDatabase();
  return Enquiry.findById(id).lean();
}

export async function updateEnquiry(id: string, data: EnquiryUpdate): Promise<IEnquiry | null> {
  await connectToDatabase();
  return Enquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function updateEnquiryStatus(id: string, status: IEnquiry["status"]): Promise<IEnquiry | null> {
  await connectToDatabase();
  return Enquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function deleteEnquiry(id: string): Promise<IEnquiry | null> {
  await connectToDatabase();
  return Enquiry.findByIdAndDelete(id).lean();
}
