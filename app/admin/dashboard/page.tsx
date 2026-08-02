import type { Metadata } from "next";
import DashboardCards from "@/components/admin/DashboardCards";
import { getCurrentAdmin } from "@/services/auth/auth.service";
import { getDashboardStats } from "@/services/dashboard.service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Fly Aerotech Solutions admin dashboard.",
};

export default async function AdminDashboardPage() {
  const [admin, stats] = await Promise.all([getCurrentAdmin(), getDashboardStats()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Welcome back, {admin?.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s an overview of your website&apos;s activity.
        </p>
      </div>

      <DashboardCards stats={stats} />
    </div>
  );
}
