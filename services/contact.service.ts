import { connectToDatabase } from "@/lib/mongodb";
import { Contact, type IContact } from "@/models";

type ContactInput = Omit<IContact, "createdAt" | "updatedAt">;
type ContactUpdate = Partial<ContactInput>;

export async function createContactSubmission(data: ContactInput): Promise<IContact> {
  await connectToDatabase();
  return Contact.create(data);
}

export async function listContactSubmissions(): Promise<IContact[]> {
  await connectToDatabase();
  return Contact.find().sort({ createdAt: -1 }).lean();
}

export async function updateContactStatus(id: string, status: IContact["status"]): Promise<IContact | null> {
  await connectToDatabase();
  return Contact.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function deleteContactSubmission(id: string): Promise<IContact | null> {
  await connectToDatabase();
  return Contact.findByIdAndDelete(id).lean();
}
