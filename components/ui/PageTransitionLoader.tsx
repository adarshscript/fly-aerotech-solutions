"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Loader branding. Drop your own `logo.png` into `public/assets/loader/` to
 * use it (no code changes needed). Falls back to the site logo otherwise.
 */
export const LOADER_LOGO_PATH = "/assets/loader/logo.png";
export const LOADER_LOGO_FALLBACK = "/logo.jpg";

const INITIAL_VISIBLE_MS = 620;
const FADE_OUT_MS = 320;
const ENTER_DELAY_MS = 140;
const MIN_VISIBLE_MS = 380;
const MAX_VISIBLE_MS = 7000;

type Phase = "idle" | "enter" | "leave";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Premium branded loader shown on first paint and during client-side route
 * transitions. Detects navigation start via clicks on internal links and the
 * back/forward history events, then fades out as soon as the new page commits
 * (tracked with usePathname). Falls back to a safety timeout so the loader can
 * never get stuck. Respects prefers-reduced-motion.
 */
export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("enter");
  const [logoSrc, setLogoSrc] = useState(LOADER_LOGO_PATH);

  const phaseRef = useRef<Phase>("enter");
  const timersRef = useRef<number[]>([]);
  const initialTimerRef = useRef<number | null>(null);
  const shownAtRef = useRef(0);
  const lastPathRef = useRef<string | null>(null);
  const navPendingRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((id) => id !== timer);
      fn();
    }, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const updatePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const finish = useCallback(() => {
    const elapsed = Date.now() - shownAtRef.current;
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
    schedule(() => {
      updatePhase("leave");
      schedule(() => updatePhase("idle"), FADE_OUT_MS);
    }, delay);
  }, [schedule, updatePhase]);

  const startNav = useCallback(() => {
    if (prefersReducedMotion()) return;
    if (initialTimerRef.current) {
      window.clearTimeout(initialTimerRef.current);
      initialTimerRef.current = null;
    }
    navPendingRef.current = true;
    schedule(() => {
      if (!navPendingRef.current) return;
      shownAtRef.current = Date.now();
      updatePhase("enter");
      schedule(() => {
        if (phaseRef.current === "enter") {
          navPendingRef.current = false;
          finish();
        }
      }, MAX_VISIBLE_MS);
    }, ENTER_DELAY_MS);
  }, [schedule, updatePhase, finish]);

  // Initial load: the loader is rendered visible during SSR so there is no
  // flash of unstyled content, then it fades out once the page is interactive.
  useEffect(() => {
    shownAtRef.current = Date.now();
    const duration = prefersReducedMotion() ? 1 : INITIAL_VISIBLE_MS;
    initialTimerRef.current = schedule(() => {
      initialTimerRef.current = null;
      updatePhase("leave");
      schedule(() => updatePhase("idle"), FADE_OUT_MS);
    }, duration);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The new page has committed once the pathname changes.
  useEffect(() => {
    const changed = lastPathRef.current !== null && lastPathRef.current !== pathname;
    lastPathRef.current = pathname;

    if (!changed) return;
    if (navPendingRef.current) {
      navPendingRef.current = false;
      finish();
    }
  }, [pathname, finish]);

  // Detect navigation start on link clicks and back/forward navigation.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (href.startsWith("/api/")) return;

      const url = new URL(href, window.location.href);
      if (url.pathname === lastPathRef.current) return;

      startNav();
    };

    const onPopState = () => {
      if (prefersReducedMotion()) return;
      navPendingRef.current = true;
      shownAtRef.current = Date.now();
      updatePhase("enter");
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [startNav, updatePhase]);

  const isVisible = phase !== "idle";

  return (
    <div
      className={cn(
        "page-loader",
        phase === "enter" && "is-active",
        phase === "leave" && "is-leaving"
      )}
      role="status"
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <div className="page-loader__panel">
        <div className="page-loader__logo">
          <span className="page-loader__ring" aria-hidden="true" />
          <Image
            src={logoSrc}
            alt=""
            width={112}
            height={112}
            priority
            unoptimized
            aria-hidden="true"
            onError={() => {
              if (logoSrc !== LOADER_LOGO_FALLBACK) setLogoSrc(LOADER_LOGO_FALLBACK);
            }}
          />
        </div>

        <svg className="page-loader__circuit" viewBox="0 0 200 18" fill="none" aria-hidden="true">
          <path className="page-loader__circuit-flow" d="M2 9 H198" />
          <path d="M30 9 V3.5" />
          <circle cx="30" cy="3.5" r="2.5" fill="#18d39e" />
          <path d="M70 9 V14.5" />
          <circle cx="70" cy="14.5" r="2.5" fill="#18d39e" />
          <path d="M110 9 V3.5" />
          <circle cx="110" cy="3.5" r="2.5" fill="#18d39e" />
          <path d="M150 9 V14.5" />
          <circle cx="150" cy="14.5" r="2.5" fill="#18d39e" />
          <path d="M185 9 V3.5" />
          <circle cx="185" cy="3.5" r="2.5" fill="#18d39e" />
        </svg>

        <div className="page-loader__track" aria-hidden="true">
          <div className="page-loader__bar" />
        </div>

        <p className="page-loader__text">Preparing your experience…</p>
      </div>
    </div>
  );
}
