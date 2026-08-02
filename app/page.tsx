import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsBand from "@/components/home/StatsBand";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import Features from "@/components/home/Features";
import CtaBanner from "@/components/home/CtaBanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fly Aerotech Solutions",
  description:
    "Software development, web development, training and internships from Vadodara, Gujarat.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <AboutPreview />
      <ServicesPreview />
      <Features />
      <CtaBanner />
    </>
  );
}
