import { connectToDatabase } from "@/lib/mongodb";
import { Settings, type ISettings } from "@/models";

type SettingsInput = Omit<ISettings, "createdAt" | "updatedAt">;

export async function getSettings(): Promise<ISettings | null> {
  await connectToDatabase();
  return Settings.findOne({}).sort({ createdAt: 1 }).lean();
}

export async function upsertSettings(data: Partial<SettingsInput>): Promise<ISettings> {
  await connectToDatabase();
  return Settings.findOneAndUpdate({}, { $set: data }, { upsert: true, new: true, runValidators: true })
    .lean()
    .then((doc) => doc as unknown as ISettings);
}
