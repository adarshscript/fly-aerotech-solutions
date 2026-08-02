"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import type { AdminPublic } from "@/services/auth/auth.service";

interface AdminShellProps {
  admin: AdminPublic;
  children: React.ReactNode;
}

export default function AdminShell({ admin, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950">
      <AdminSidebar admin={admin} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar admin={admin} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
