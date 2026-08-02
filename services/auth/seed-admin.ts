import "server-only";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models";
import { isValidEmail } from "@/lib/validators";

const BCRYPT_ROUNDS = 12;

export interface SuperAdminSeedResult {
  created: boolean;
  adminId: string;
  email: string;
  warning?: string;
}

export async function seedSuperAdmin(): Promise<SuperAdminSeedResult> {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = (process.env.ADMIN_NAME ?? "Super Admin").trim();

  if (!email || !isValidEmail(email)) {
    throw new Error("ADMIN_EMAIL is missing or invalid. Set it in .env.local");
  }
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters. Set it in .env.local");
  }
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is missing. Set it in .env.local");
  }

  await connectToDatabase();

  const existing = await Admin.findOne({ email }).lean();
  if (existing) {
    if (existing.role !== "superadmin") {
      await Admin.findByIdAndUpdate(existing._id, {
        role: "superadmin",
        isActive: true,
        name,
      });
    }
    return {
      created: false,
      adminId: String(existing._id),
      email,
      warning:
        existing.role === "superadmin"
          ? "Super admin already exists. Password left unchanged."
          : "Existing account promoted to superadmin.",
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const doc = await Admin.create({ name, email, passwordHash, role: "superadmin", isActive: true });

  return { created: true, adminId: String(doc._id), email };
}
