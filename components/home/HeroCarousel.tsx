"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, GraduationCap, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import type { HeroSlideItem } from "@/types";

interface HeroCarouselProps {
  slides: HeroSlideItem[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const count = slides.length;
  const slide = slides[active];

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setActive((prev) => (prev + 1) % count), 7000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) {
    return null;
  }

  const badge = slide.badge ?? `MSME Registered · ${site.city}`;
  const ctaPrimary =
    slide.ctaLabel && slide.ctaHref ? (
      <Button href={slide.ctaHref} size="lg">
        {slide.ctaLabel} <ArrowRight className="size-4" aria-hidden />
      </Button>
    ) : (
      <Button href="/services" size="lg">
        Explore Services <ArrowRight className="size-4" aria-hidden />
      </Button>
    );

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(15_201_139/0.22),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(22_58_117/0.55),transparent_60%)]"
        aria-hidden
      />
      <div className="absolute -top-32 right-1/4 size-96 rounded-full bg-tech-500/20 blur-3xl animate-float" aria-hidden />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <div key={active} className="animate-fade-up">
          <Badge className="mb-6">
            <Sparkles className="size-3.5" aria-hidden /> {badge}
          </Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {slide.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {ctaPrimary}
            <Button href="/contact" variant="white" size="lg">
              Get in Touch
            </Button>
          </div>
          {count > 1 && (
            <div className="mt-9 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-8 bg-tech-400" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-navy-950/60">
            <Image
              key={`img-${active}`}
              src={slide.image ?? images.hero}
              alt={slide.title}
              width={1200}
              height={800}
              className="aspect-[3/2] w-full object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" aria-hidden />
          </div>

          <div className="glass absolute -left-4 top-8 hidden items-center gap-3 rounded-2xl px-5 py-4 shadow-xl sm:flex animate-float">
            <span className="flex size-10 items-center justify-center rounded-xl bg-tech-500/20 text-tech-400">
              <GraduationCap className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Training & Internship</p>
              <p className="text-xs text-navy-200">Industry-aligned programs</p>
            </div>
          </div>

          <div className="glass absolute -bottom-5 -right-3 hidden items-center gap-3 rounded-2xl px-5 py-4 shadow-xl sm:flex animate-float-slow">
            <span className="flex size-10 items-center justify-center rounded-xl bg-tech-500/20 text-tech-400">
              <BadgeCheck className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">MSME Registered</p>
              <p className="font-mono text-[10px] text-navy-200">{site.msme}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
