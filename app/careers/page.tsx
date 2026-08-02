import type { Metadata } from "next";
import { Briefcase, HeartHandshake, MapPin, TrendingUp } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { careerRoles } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Build your career with ${site.name}, Vadodara. Explore current openings in software, web, and training.`,
};

const perks = [
  { Icon: TrendingUp, title: "Growth Path", description: "Clear skill and career progression for every role." },
  { Icon: HeartHandshake, title: "Supportive Team", description: "Collaborative, learning-first engineering culture." },
  { Icon: MapPin, title: "Vadodara Based", description: "Work from our Vadodara studio with hybrid flexibility." },
];

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Grow your career with a team that invests in you"
        description="Join Fly Aerotech Solutions and work on real products while continuously leveling up your skills."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Open Positions"
            title="Current openings"
            description="Apply by emailing your resume. We reply to every application."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {careerRoles.map((role, index) => (
              <Reveal key={role.title} delay={index * 80}>
                <article className="h-full rounded-2xl border border-navy-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-tech-400">
                        <Briefcase className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-navy-900">{role.title}</h3>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="size-3.5" aria-hidden /> {role.location}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-tech-500/10 px-3 py-1 text-xs font-bold text-tech-600">
                      {role.type}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{role.description}</p>
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(
                      `Application — ${role.title} (${site.name})`
                    )}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-tech-600 transition-colors hover:text-tech-500"
                  >
                    Apply for this role &rarr;
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-navy-50/60">
        <Container>
          <SectionHeading
            eyebrow="Why Join Us"
            title="Perks of being a Fly Aerotech team member"
            description="We build software, but we grow people first."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {perks.map((perk, index) => (
              <Reveal key={perk.title} delay={index * 80}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-navy-900 text-tech-400">
                    <perk.Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-navy-900">{perk.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{perk.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button href="/contact" size="lg">
              Contact Our HR Team
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
