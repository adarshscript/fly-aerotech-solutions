import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { getGalleryItems } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: `A look inside ${site.name} — our team, training sessions, events and projects.`,
};

const categoryStyles: Record<string, string> = {
  campus: "bg-navy-100 text-navy-800",
  training: "bg-tech-100 text-tech-600",
  events: "bg-tech-500 text-navy-950",
  projects: "bg-navy-900 text-white",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from our studio, sessions and events"
        description="Photos are stored centrally and served from the database."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Our Work & Culture"
            title="A glimpse into life at Fly Aerotech"
            description="Training sessions, development sprints, events and the team behind it all."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <figure className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${categoryStyles[item.category]}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <figcaption className="p-5">
                    <h3 className="text-base font-bold text-navy-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">Fly Aerotech Solutions</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
