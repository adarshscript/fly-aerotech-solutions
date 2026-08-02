import { connectToDatabase } from "@/lib/mongodb";
import { Service, type IService } from "@/models";

type ServiceInput = Omit<IService, "createdAt" | "updatedAt">;
type ServiceUpdate = Partial<ServiceInput>;

export async function listActiveServices(): Promise<IService[]> {
  await connectToDatabase();
  return Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
}

export async function listHomeServices(): Promise<IService[]> {
  await connectToDatabase();
  return Service.find({ isActive: true, showOnHome: true }).sort({ order: 1 }).lean();
}

export async function getAllServices(): Promise<IService[]> {
  await connectToDatabase();
  return Service.find().sort({ order: 1 }).lean();
}

export async function getServiceBySlug(slug: string): Promise<IService | null> {
  await connectToDatabase();
  return Service.findOne({ slug, isActive: true }).lean();
}

export async function createService(data: ServiceInput): Promise<IService> {
  await connectToDatabase();
  return Service.create(data);
}

export async function updateService(id: string, data: ServiceUpdate): Promise<IService | null> {
  await connectToDatabase();
  return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteService(id: string): Promise<IService | null> {
  await connectToDatabase();
  return Service.findByIdAndDelete(id).lean();
}
