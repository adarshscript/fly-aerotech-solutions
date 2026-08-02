import { connectToDatabase } from "@/lib/mongodb";
import { Admin, type IAdmin } from "@/models";

type AdminInput = Omit<IAdmin, "createdAt" | "updatedAt">;
type AdminUpdate = Partial<AdminInput>;

export async function findAdminByEmail(email: string): Promise<IAdmin | null> {
  await connectToDatabase();
  return Admin.findOne({ email, isActive: true }).select("+passwordHash").lean();
}

export async function listAdmins(): Promise<IAdmin[]> {
  await connectToDatabase();
  return Admin.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
}

export async function createAdmin(data: AdminInput): Promise<IAdmin> {
  await connectToDatabase();
  return Admin.create(data);
}

export async function updateAdmin(id: string, data: AdminUpdate): Promise<IAdmin | null> {
  await connectToDatabase();
  return Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-passwordHash").lean();
}

export async function recordLastLogin(id: string): Promise<void> {
  await connectToDatabase();
  await Admin.findByIdAndUpdate(id, { lastLogin: new Date() });
}

export async function deleteAdmin(id: string): Promise<IAdmin | null> {
  await connectToDatabase();
  return Admin.findByIdAndDelete(id).lean();
}
