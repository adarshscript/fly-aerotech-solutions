"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, LayoutDashboard, LogOut, User } from "lucide-react";
import type { AdminPublic } from "@/services/auth/auth.service";
import { logoutAction } from "@/app/admin/actions";

interface ProfileDropdownProps {
  admin: AdminPublic;
}

export default function ProfileDropdown({ admin }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = admin.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-navy-800"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-tech-500/20 text-sm font-bold text-tech-600 dark:text-tech-400">
          {initials}
        </span>
        <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
          {admin.name}
        </span>
        <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-navy-950/10 dark:border-navy-700 dark:bg-navy-800">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-navy-700">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {admin.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{admin.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-tech-500/15 px-2 py-0.5 text-[11px] font-semibold text-tech-600 dark:text-tech-400">
              {admin.roleLabel}
            </span>
          </div>

          <div className="p-1.5">
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-navy-700"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-navy-700"
            >
              <User className="size-4" />
              Profile &amp; Password
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-navy-700"
            >
              <ExternalLink className="size-4" />
              View Website
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
