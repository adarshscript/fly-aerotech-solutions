import type { Metadata } from "next";
import { KeyRound, UserRound, CalendarDays, ShieldCheck } from "lucide-react";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import ProfileForm from "@/components/admin/ProfileForm";
import { getCurrentAdmin } from "@/services/auth/auth.service";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your admin profile and password.",
};

function formatDate(value?: Date | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update your personal details and password.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1 dark:border-navy-800 dark:bg-navy-900">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-tech-500/20 text-xl font-bold text-tech-600 dark:text-tech-400">
              {admin.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{admin.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{admin.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-tech-500/15 px-3 py-1 text-xs font-semibold text-tech-600 dark:text-tech-400">
              <ShieldCheck className="size-3.5" />
              {admin.roleLabel}
            </span>
          </div>

          <dl className="border-t border-slate-100 px-6 py-4 space-y-3 dark:border-navy-800">
            <div className="flex items-center gap-3 text-sm">
              <UserRound className="size-4 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Role</span>
              <span className="ml-auto font-medium text-slate-800 capitalize dark:text-slate-100">
                {admin.role}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="size-4 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Member since</span>
              <span className="ml-auto font-medium text-slate-800 dark:text-slate-100">
                {formatDate(admin.createdAt)}
              </span>
            </div>
          </dl>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <div className="mb-5 flex items-center gap-2">
              <UserRound className="size-5 text-tech-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h2>
            </div>
            <ProfileForm name={admin.name} email={admin.email} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <div className="mb-5 flex items-center gap-2">
              <KeyRound className="size-5 text-tech-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Change Password
              </h2>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
