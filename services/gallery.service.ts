import { connectToDatabase } from "@/lib/mongodb";
import { Gallery, type IGallery } from "@/models";

type GalleryInput = Omit<IGallery, "createdAt" | "updatedAt">;
type GalleryUpdate = Partial<GalleryInput>;

export async function listGalleryImages(): Promise<IGallery[]> {
  await connectToDatabase();
  return Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
}

export async function getAllGalleryImages(): Promise<IGallery[]> {
  await connectToDatabase();
  return Gallery.find().sort({ order: 1, createdAt: -1 }).lean();
}

export async function createGalleryImage(data: GalleryInput): Promise<IGallery> {
  await connectToDatabase();
  return Gallery.create(data);
}

export async function updateGalleryImage(id: string, data: GalleryUpdate): Promise<IGallery | null> {
  await connectToDatabase();
  return Gallery.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteGalleryImage(id: string): Promise<IGallery | null> {
  await connectToDatabase();
  return Gallery.findByIdAndDelete(id).lean();
}
