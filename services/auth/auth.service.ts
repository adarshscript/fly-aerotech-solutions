import "server-only";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models";
import { isValidEmail } from "@/lib/validators";
import { createSessionCookie, destroySession, readSession } from "@/services/auth/session";
import { isAdminRole, ROLE_LABELS, type AdminRole } from "@/services/auth/roles";

export interface AdminPublic {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt?: Date | null;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  admin?: AdminPublic;
}

const PASSWORD_MIN = 8;
const BCRYPT_ROUNDS = 12;

function toAdminPublic(doc: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt?: Date | null;
}): AdminPublic | null {
  if (!isAdminRole(doc.role)) return null;
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    roleLabel: ROLE_LABELS[doc.role],
    isActive: doc.isActive,
    lastLogin: doc.lastLogin ?? null,
    createdAt: doc.createdAt ?? null,
  };
}

export async function getCurrentAdmin(): Promise<AdminPublic | null> {
  const session = await readSession();
  if (!session?.sub) return null;

  await connectToDatabase();
  const doc = await Admin.findById(session.sub).lean();
  if (!doc || !doc.isActive) return null;

  return toAdminPublic(doc);
}

export async function loginAdmin(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!password || password.length < PASSWORD_MIN) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  await connectToDatabase();
  const doc = await Admin.findOne({ email: normalizedEmail }).select("+passwordHash").lean();
  if (!doc || !doc.isActive) {
    return { ok: false, error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(password, doc.passwordHash);
  if (!passwordMatches) {
    return { ok: false, error: "Invalid email or password." };
  }

  await Admin.findByIdAndUpdate(doc._id, { lastLogin: new Date() });

  const admin = toAdminPublic(doc);
  if (!admin) {
    return { ok: false, error: "This account has an unsupported role." };
  }

  await createSessionCookie({ sub: admin.id, email: admin.email, name: admin.name, role: admin.role });
  return { ok: true, admin };
}

export async function logoutAdmin(): Promise<void> {
  await destroySession();
}

export async function updateAdminProfile(input: {
  name: string;
  email: string;
}): Promise<AuthResult> {
  const session = await readSession();
  if (!session?.sub) return { ok: false, error: "You must be signed in." };

  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";

  if (name.length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  await connectToDatabase();

  const duplicate = await Admin.findOne({ email, _id: { $ne: session.sub } }).lean();
  if (duplicate) {
    return { ok: false, error: "That email is already in use." };
  }

  const doc = await Admin.findByIdAndUpdate(
    session.sub,
    { name, email },
    { new: true, runValidators: true }
  ).lean();
  if (!doc || !doc.isActive) {
    return { ok: false, error: "Account not found." };
  }

  const admin = toAdminPublic(doc);
  if (!admin) return { ok: false, error: "This account has an unsupported role." };

  await createSessionCookie({ sub: admin.id, email: admin.email, name: admin.name, role: admin.role });
  return { ok: true, admin };
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AuthResult> {
  const session = await readSession();
  if (!session?.sub) return { ok: false, error: "You must be signed in." };

  if (!input.currentPassword) {
    return { ok: false, error: "Enter your current password." };
  }
  if (!input.newPassword || input.newPassword.length < PASSWORD_MIN) {
    return { ok: false, error: `New password must be at least ${PASSWORD_MIN} characters.` };
  }
  if (input.newPassword !== input.confirmPassword) {
    return { ok: false, error: "New password and confirmation do not match." };
  }
  if (input.newPassword === input.currentPassword) {
    return { ok: false, error: "New password must be different from the current one." };
  }

  await connectToDatabase();
  const doc = await Admin.findById(session.sub).select("+passwordHash").lean();
  if (!doc || !doc.isActive) {
    return { ok: false, error: "Account not found." };
  }

  const currentMatches = await bcrypt.compare(input.currentPassword, doc.passwordHash);
  if (!currentMatches) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
  await Admin.findByIdAndUpdate(session.sub, { passwordHash });

  return { ok: true };
}
