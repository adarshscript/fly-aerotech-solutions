"use client";
import { ExternalLink, Menu } from "lucide-react";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import ProfileDropdown from "@/components/admin/ProfileDropdown";
import ThemeToggle from "@/components/admin/ThemeToggle";
import type { AdminPublic } from "@/services/auth/auth.service";

interface AdminTopbarProps {
  admin: AdminPublic;
  onOpenSidebar: () => void;
}

export default function AdminTopbar({ admin, onOpenSidebar }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-navy-800 dark:bg-navy-900/80">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
        >
          <Menu className="size-5" />
        </button>
        <p className="hidden min-w-0 truncate text-sm font-medium text-slate-500 sm:block dark:text-slate-400">
          Signed in as{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{admin.roleLabel}</span>
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:flex dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white"
        >
          <ExternalLink className="size-4" />
          View Site
        </a>
        <ThemeToggle />
        <NotificationsDropdown />
        <ProfileDropdown admin={admin} />
      </div>
    </header>
  );
}
