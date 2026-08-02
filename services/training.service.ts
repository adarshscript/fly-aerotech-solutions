import { connectToDatabase } from "@/lib/mongodb";
import { Training, type ITraining } from "@/models";

type TrainingInput = Omit<ITraining, "createdAt" | "updatedAt">;
type TrainingUpdate = Partial<TrainingInput>;

export async function listUpcomingTrainings(): Promise<ITraining[]> {
  await connectToDatabase();
  return Training.find({ status: { $in: ["upcoming", "running"] }, isActive: true })
    .sort({ startDate: 1 })
    .lean();
}

export async function listActiveTrainings(): Promise<ITraining[]> {
  await connectToDatabase();
  return Training.find({ isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function getAllTrainings(): Promise<ITraining[]> {
  await connectToDatabase();
  return Training.find().sort({ createdAt: -1 }).lean();
}

export async function getTrainingBySlug(slug: string): Promise<ITraining | null> {
  await connectToDatabase();
  return Training.findOne({ slug, isActive: true }).lean();
}

export async function createTraining(data: TrainingInput): Promise<ITraining> {
  await connectToDatabase();
  return Training.create(data);
}

export async function updateTraining(id: string, data: TrainingUpdate): Promise<ITraining | null> {
  await connectToDatabase();
  return Training.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteTraining(id: string): Promise<ITraining | null> {
  await connectToDatabase();
  return Training.findByIdAndDelete(id).lean();
}
