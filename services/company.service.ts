import { connectToDatabase } from "@/lib/mongodb";
import { Company, type ICompany } from "@/models";

type CompanyInput = Omit<ICompany, "createdAt" | "updatedAt">;

export async function getCompany(): Promise<ICompany | null> {
  await connectToDatabase();
  return Company.findOne({}).sort({ createdAt: 1 }).lean();
}

export async function upsertCompany(data: CompanyInput): Promise<ICompany> {
  await connectToDatabase();
  return Company.findOneAndUpdate({}, { $set: data }, { upsert: true, new: true, runValidators: true })
    .lean()
    .then((doc) => doc as unknown as ICompany);
}
