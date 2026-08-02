"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  Briefcase,
  FileText,
  GalleryHorizontalEnd,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminPublic } from "@/services/auth/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Students", href: "/admin/students", icon: Users },
      { label: "Courses", href: "/admin/courses", icon: GraduationCap },
      { label: "Training", href: "/admin/training", icon: Rocket, soon: true },
      { label: "Internships", href: "/admin/internships", icon: Briefcase, soon: true },
      { label: "Services", href: "/admin/services", icon: Wrench, soon: true },
      { label: "Certificates", href: "/admin/certificates", icon: Award },
      { label: "Blog", href: "/admin/blog", icon: FileText, soon: true },
      { label: "Gallery", href: "/admin/gallery", icon: GalleryHorizontalEnd, soon: true },
    ],
  },
  {
    title: "Inbox & System",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare, soon: true },
      { label: "Notifications", href: "/admin/notifications", icon: Bell, soon: true },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  admin: AdminPublic;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ admin, mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-950 text-white transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-tech-400 to-tech-600">
              <ShieldCheck className="size-5 text-navy-950" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">Fly Aerotech</p>
              <p className="text-[11px] text-tech-400">Admin Panel</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      {item.soon ? (
                        <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40">
                          <Icon className="size-4.5 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50">
                            Soon
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                            active
                              ? "bg-tech-500/15 font-semibold text-tech-400"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <Icon className="size-4.5 shrink-0" />
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tech-500/20 text-sm font-bold text-tech-400">
              {admin.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">{admin.name}</p>
              <p className="truncate text-xs text-tech-400">{admin.roleLabel}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
