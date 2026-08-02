import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { images } from "@/lib/images";
import { businessActivities, site } from "@/lib/site";

export default function AboutPreview() {
  const highlights = businessActivities.slice(0, 6);

  return (
    <section className="section-padding overflow-hidden">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div
              className="absolute -left-8 -top-8 size-40 rounded-3xl bg-tech-500/15 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-xl shadow-navy-950/10">
              <Image
                src={images.team[0]}
                alt="About Fly Aerotech Solutions"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
                unoptimized
              />
            </div>
            <div className="glass-card absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg">
              <span className="text-2xl font-bold text-navy-900">
                <span className="text-gradient">09+</span>
              </span>
              <span className="text-sm font-medium text-slate-600">
                Business
                <br />
                Domains
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="A full-stack technology partner from Vadodara"
            description={`${site.name} is a Vadodara-based MSME offering complete software and technology services — from programming and web development to training and internships — with a commitment to quality, research and support.`}
            className="mb-8"
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {highlights.map((activity) => (
              <li key={activity} className="flex items-center gap-2.5 text-sm font-medium text-navy-800">
                <CheckCircle2 className="size-4.5 shrink-0 text-tech-500" aria-hidden />
                {activity}
              </li>
            ))}
          </ul>
          <Button href="/about" variant="outline" className="mt-9">
            Learn More About Us <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
