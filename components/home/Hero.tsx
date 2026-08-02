import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { getHeroSlides } from "@/lib/content";
import HeroCarousel from "@/components/home/HeroCarousel";
import type { HeroSlideItem } from "@/types";

export default async function Hero() {
  const slides = await getHeroSlides();

  const fallback: HeroSlideItem[] = [
    {
      badge: `MSME Registered · ${site.city}`,
      title: `Building tomorrow\u2019s software, today.`,
      subtitle: `${site.name} delivers end-to-end software development, technology consulting, training and internship programs — helping businesses grow and students build real-world skills.`,
      image: images.hero,
      ctaLabel: "Explore Services",
      ctaHref: "/services",
    },
  ];

  return <HeroCarousel slides={slides.length > 0 ? slides : fallback} />;
}
