"use client";
import { Moon, Sun } from "lucide-react";
import { ADMIN_THEME_KEY } from "@/components/admin/ThemeScript";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem(ADMIN_THEME_KEY, next ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </button>
  );
}
