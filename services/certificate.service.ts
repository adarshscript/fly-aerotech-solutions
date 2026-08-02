import { connectToDatabase } from "@/lib/mongodb";
import { Certificate, type ICertificate } from "@/models";

type CertificateInput = Omit<ICertificate, "createdAt" | "updatedAt">;
type CertificateUpdate = Partial<CertificateInput>;

export async function findCertificate(referenceNo: string): Promise<ICertificate | null> {
  await connectToDatabase();
  return Certificate.findOne({ referenceNo }).populate("student course").lean();
}

export async function listCertificates(): Promise<ICertificate[]> {
  await connectToDatabase();
  return Certificate.find().sort({ createdAt: -1 }).lean();
}

export async function createCertificate(data: CertificateInput): Promise<ICertificate> {
  await connectToDatabase();
  return Certificate.create(data);
}

export async function updateCertificate(id: string, data: CertificateUpdate): Promise<ICertificate | null> {
  await connectToDatabase();
  return Certificate.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function verifyCertificate(id: string): Promise<ICertificate | null> {
  await connectToDatabase();
  return Certificate.findByIdAndUpdate(id, { isVerified: true }, { new: true }).lean();
}

export async function deleteCertificate(id: string): Promise<ICertificate | null> {
  await connectToDatabase();
  return Certificate.findByIdAndDelete(id).lean();
}
