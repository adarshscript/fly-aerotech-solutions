import { connectToDatabase } from "@/lib/mongodb";
import { HeroSlide, type IHeroSlide } from "@/models";

type HeroSlideInput = Omit<IHeroSlide, "createdAt" | "updatedAt">;
type HeroSlideUpdate = Partial<HeroSlideInput>;

export async function listActiveHeroSlides(): Promise<IHeroSlide[]> {
  await connectToDatabase();
  return HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getAllHeroSlides(): Promise<IHeroSlide[]> {
  await connectToDatabase();
  return HeroSlide.find().sort({ order: 1 }).lean();
}

export async function createHeroSlide(data: HeroSlideInput): Promise<IHeroSlide> {
  await connectToDatabase();
  return HeroSlide.create(data);
}

export async function updateHeroSlide(id: string, data: HeroSlideUpdate): Promise<IHeroSlide | null> {
  await connectToDatabase();
  return HeroSlide.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteHeroSlide(id: string): Promise<IHeroSlide | null> {
  await connectToDatabase();
  return HeroSlide.findByIdAndDelete(id).lean();
}
