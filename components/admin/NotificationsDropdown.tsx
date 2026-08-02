"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, Info } from "lucide-react";

export default function NotificationsDropdown() {
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

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
      >
        <Bell className="size-5" />
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-tech-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-navy-950/10 dark:border-navy-700 dark:bg-navy-800">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-navy-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
          </div>
          <div className="p-6 text-center">
            <span className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-navy-700">
              <Info className="size-5 text-slate-400 dark:text-slate-500" />
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300">No notifications yet</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              New enquiries and activity will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
