import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, MapPin, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { getInternshipRoles } from "@/lib/content";
import { images } from "@/lib/images";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internship",
  description: `Real-world internship opportunities at ${site.name}, Vadodara — software, web, R&D and support.`,
};

const benefits = [
  "Work on real, production-grade projects",
  "Mentorship from senior engineers",
  "Certificate with unique verification reference",
  "Flexible hybrid and remote options",
  "Hands-on exposure to industry tooling",
  "Letter of recommendation on performance",
];

export default async function InternshipPage() {
  const internshipRoles = await getInternshipRoles();

  return (
    <>
      <PageHeader
        eyebrow="Internship Program"
        title="Kick-start your career with real engineering work"
        description="An internship at Fly Aerotech Solutions means shipping real features, learning modern tooling and growing under experienced mentors."
      />

      <section className="section-padding">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -left-8 -top-8 size-40 rounded-3xl bg-tech-500/15 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-xl shadow-navy-950/10">
                <Image
                  src={internshipRoles[0]?.image ?? images.hero}
                  alt="Interns working at Fly Aerotech Solutions"
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
              eyebrow="Why Intern With Us"
              title="Learn by doing, not by watching"
              className="mb-7"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm font-medium text-navy-800">
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-tech-500" aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
            <Button href="/contact" size="lg" className="mt-9">
              Apply for Internship <Rocket className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="section-padding bg-navy-50/60">
        <Container>
          <SectionHeading
            eyebrow="Open Positions"
            title="Current internship opportunities"
            description="We hire interns in small batches every quarter. Apply early — seats are limited."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {internshipRoles.map((role, index) => (
              <Reveal key={role.title} delay={index * 80}>
                <article className="h-full rounded-2xl border border-navy-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-tech-400">
                      <BadgeCheck className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-navy-900">{role.title}</h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="size-3.5" aria-hidden /> {role.domain} &middot; {role.mode}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{role.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-tech-500/10 px-3 py-1 text-xs font-semibold text-tech-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Ready to apply?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
            Send your resume and a short note about your goals to {site.email}.
          </p>
          <Button
            href={`mailto:${site.email}?subject=${encodeURIComponent("Internship Application — Fly Aerotech Solutions")}`}
            size="lg"
            className="mt-8"
          >
            Apply Now
          </Button>
        </Container>
      </section>
    </>
  );
}
