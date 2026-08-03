"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, UserRound, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Container from "@/components/ui/Container";
import { navLinks, utilityLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CompanyInfo } from "@/types";

interface NavbarProps {
  company?: CompanyInfo | null;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar({ company }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
      lastFocusedRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleDrawerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (active === first || !active) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-navy-100/80 bg-white/85 shadow-sm shadow-navy-950/5 backdrop-blur-xl"
            : "border-b border-transparent bg-white/60 backdrop-blur-md"
        )}
      >
        <Container className="relative flex h-16 items-center justify-between gap-2 sm:h-[4.5rem] sm:gap-3">
          <Logo company={company} navbar tagline="SOFTWARE DEVELOPMENT" />

          <nav
            aria-label="Primary"
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap lg:flex xl:gap-1.5"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full font-medium transition-colors",
                  "lg:px-1.5 lg:py-1.5 lg:text-xs xl:px-2.5 xl:py-2 xl:text-sm",
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-900"
                    : "text-slate-600 hover:bg-navy-50/60 hover:text-navy-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {utilityLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition-all",
                  item.label === "Login"
                    ? "inline-flex border-tech-500 bg-tech-500 px-3.5 py-2 text-[13px] text-navy-950 hover:bg-tech-400 lg:px-3 xl:px-4 xl:text-sm"
                    : "hidden border-navy-200 bg-white px-3.5 py-2 text-[13px] text-navy-800 hover:border-tech-500 hover:text-tech-600 md:inline-flex lg:px-2.5 xl:px-3.5 xl:text-sm"
                )}
              >
                {item.label === "Student" ? (
                  <UserRound className="size-4 lg:hidden xl:block" aria-hidden />
                ) : null}
                {item.label === "Verify" ? (
                  <ShieldCheck className="size-4 lg:hidden xl:block" aria-hidden />
                ) : null}
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-navy-100 text-navy-900 transition-colors hover:bg-navy-50 md:size-10 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      <div
        id="mobile-nav-panel"
        className={cn("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          aria-hidden="true"
          onClick={close}
          className={cn(
            "absolute inset-0 bg-navy-950/40 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={handleDrawerKeyDown}
          className={cn(
            "absolute top-0 right-0 flex h-full w-[80%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl shadow-navy-950/20 transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-navy-100/80 px-5 py-4">
            <span className="text-base font-bold tracking-tight text-navy-900">Menu</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full border border-navy-100 text-navy-900 transition-colors hover:bg-navy-50"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex shrink-0 flex-col gap-1 p-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-900"
                    : "text-slate-600 hover:bg-navy-50/60 hover:text-navy-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-navy-100/80 p-4">
            {utilityLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  item.label === "Login"
                    ? "bg-tech-500 text-navy-950 hover:bg-tech-400"
                    : "border border-navy-200 text-navy-800 hover:border-tech-500 hover:text-tech-600"
                )}
              >
                {item.label === "Student" ? <UserRound className="size-4" aria-hidden /> : null}
                {item.label === "Verify" ? <ShieldCheck className="size-4" aria-hidden /> : null}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
