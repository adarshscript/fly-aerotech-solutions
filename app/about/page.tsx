import type { Metadata } from "next";
import Image from "next/image";
import { Award, Compass, Eye, MapPin, ShieldCheck, Target } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { images } from "@/lib/images";
import { businessActivities, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}, a Vadodara-based MSME delivering software, web development, training and internships.`,
};

const pillars = [
  {
    Icon: Target,
    title: "Our Mission",
    description:
      "To deliver dependable software and technology solutions while equipping the next generation of engineers with industry-ready skills.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    description:
      "To be a trusted technology partner in Vadodara and beyond — known for quality, research-driven work and people-first training.",
  },
  {
    Icon: Compass,
    title: "Our Values",
    description:
      "Quality-first engineering, transparency, continuous learning, and genuine support for every client, trainee and intern.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A Vadodara-based MSME building software and talent"
        description={`${site.name} is a registered MSME (${site.msme}) specialising in software development, technology consulting, training and internships.`}
      />

      <section className="section-padding">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -right-8 -top-8 size-40 rounded-3xl bg-tech-500/15 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-xl shadow-navy-950/10">
                <Image
                  src={images.services[0]}
                  alt="Fly Aerotech Solutions team at work"
                  width={900}
                  height={640}
                  className="aspect-[4/3] w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="Engineering, research and training under one roof"
              className="mb-7"
            />
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              <p>
                Headquartered in {site.city}, {site.name} was established to fill a simple gap — most businesses
                struggle to find a single partner for software development, technical support and talent building.
              </p>
              <p>
                We combine computer programming, web and software development with research &amp; development to
                deliver products and services that are built to last. At the same time, our training and internship
                programs give students real, hands-on engineering experience.
              </p>
              <p>
                As an MSME-registered company, we are committed to supporting local talent, scientific services and
                technology consulting across India.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-padding bg-navy-50/60">
        <Container>
          <SectionHeading
            eyebrow="Mission & Vision"
            title="What drives us every day"
            description="A clear purpose keeps every project, program and partnership focused on real outcomes."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 100}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-tech-400">
                    <pillar.Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Business Activities"
            title="Nine domains, one quality standard"
            description="Our MSME-registered business activities span the full spectrum of technology services."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {businessActivities.map((activity, index) => (
              <Reveal key={activity} delay={index * 50}>
                <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:border-tech-500 hover:text-tech-600">
                  <ShieldCheck className="size-4 text-tech-500" aria-hidden />
                  {activity}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 grid gap-6 rounded-3xl bg-navy-900 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
              {[
                { Icon: Award, label: "MSME Registered", value: site.msme },
                { Icon: MapPin, label: "Location", value: site.location },
                { Icon: ShieldCheck, label: "Compliance", value: "Government Certified" },
                { Icon: MapPin, label: "Base City", value: site.city },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tech-500/15 text-tech-400">
                    <item.Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-navy-200 uppercase">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-padding bg-navy-50/60">
        <Container>
          <SectionHeading
            eyebrow="Our Team"
            title="A small, skilled team with big ambitions"
            description="Real team photos and profiles will be managed through the admin panel in a future phase."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {images.teamMembers.map((image, index) => (
              <Reveal key={image} delay={index * 100}>
                <div className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="overflow-hidden">
                    <Image
                      src={image}
                      alt="Team member"
                      width={600}
                      height={700}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 text-center">
                    <p className="text-sm font-semibold text-navy-900">Team Member</p>
                    <p className="text-xs text-slate-500">Fly Aerotech Solutions</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Want to work with us?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
            Let&rsquo;s talk about your software, training or internship needs.
          </p>
          <Button href="/contact" size="lg" className="mt-8">
            Get in Touch
          </Button>
        </Container>
      </section>
    </>
  );
}
