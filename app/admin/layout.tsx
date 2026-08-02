import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ThemeScript from "@/components/admin/ThemeScript";
import { getCurrentAdmin } from "@/services/auth/auth.service";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin-login");

  return (
    <>
      <ThemeScript />
      <AdminShell admin={admin}>{children}</AdminShell>
    </>
  );
}
