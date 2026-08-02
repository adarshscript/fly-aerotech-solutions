"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, UserRound, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Container from "@/components/ui/Container";
import { navLinks, utilityLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-navy-100/80 bg-white/85 shadow-sm shadow-navy-950/5 backdrop-blur-xl"
          : "border-b border-transparent bg-white/60 backdrop-blur-md"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-navy-50 text-navy-900"
                  : "text-slate-600 hover:bg-navy-50/60 hover:text-navy-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {utilityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                item.label === "Login"
                  ? "border-tech-500 bg-tech-500 text-navy-950 hover:bg-tech-400"
                  : "border-navy-200 bg-white text-navy-800 hover:border-tech-500 hover:text-tech-600"
              )}
            >
              {item.label === "Student" ? <UserRound className="size-4" aria-hidden /> : null}
              {item.label === "Verify" ? <ShieldCheck className="size-4" aria-hidden /> : null}
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-navy-100 text-navy-900 transition-colors hover:bg-navy-50 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-navy-100/80 bg-white/95 backdrop-blur-xl lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-900"
                    : "text-slate-600 hover:bg-navy-50/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-navy-100/80 pt-3">
              {utilityLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                    item.label === "Login"
                      ? "bg-tech-500 text-navy-950 hover:bg-tech-400"
                      : "border border-navy-200 text-navy-800 hover:border-tech-500"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
