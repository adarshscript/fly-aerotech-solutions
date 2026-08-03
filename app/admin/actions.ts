"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  changeAdminPassword,
  logoutAdmin,
  updateAdminProfile,
} from "@/services/auth/auth.service";
import {
  updateCompanySettings,
  type CompanySettingsInput,
} from "@/services/company.service";

export interface AdminFormState {
  ok?: boolean;
  error?: string;
}

export interface CompanyFormState {
  ok?: boolean;
  error?: string;
  message?: string;
}

export async function logoutAction(): Promise<void> {
  try {
    await logoutAdmin();
  } catch (error) {
    console.error("[actions] logout failed:", error);
  }
  redirect("/admin-login");
}

export async function updateProfileAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  try {
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
  } catch (error) {
    console.error("[actions] updateProfileAction failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not update profile.",
    };
  }
}

export async function changePasswordAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  try {
    const result = await changeAdminPassword({
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    if (!result.ok) {
      return { ok: false, error: result.error ?? "Could not change password." };
    }

    return { ok: true };
  } catch (error) {
    console.error("[actions] changePasswordAction failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not change password.",
    };
  }
}

export async function updateCompanyAction(
  _prev: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  try {
    const raw = String(formData.get("payload") ?? "");
    if (!raw) return { ok: false, error: "No data received." };

    let input: CompanySettingsInput;
    try {
      input = JSON.parse(raw) as CompanySettingsInput;
    } catch {
      return { ok: false, error: "Invalid form payload." };
    }

    const result = await updateCompanySettings(input);
    if (!result.ok) return { ok: false, error: result.error };

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Company settings saved. Changes are live across the website." };
  } catch (error) {
    console.error("[actions] updateCompanyAction failed:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not save company settings. Please try again.",
    };
  }
}
