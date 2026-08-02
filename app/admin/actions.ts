"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  changeAdminPassword,
  logoutAdmin,
  updateAdminProfile,
} from "@/services/auth/auth.service";

export interface AdminFormState {
  ok?: boolean;
  error?: string;
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin-login");
}

export async function updateProfileAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const result = await updateAdminProfile({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Could not update profile." };
  }

  revalidatePath("/admin/profile");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function changePasswordAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const result = await changeAdminPassword({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Could not change password." };
  }

  return { ok: true };
}
