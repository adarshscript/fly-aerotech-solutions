import { Headset, Rocket, ShieldCheck, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const features = [
  {
    Icon: Rocket,
    title: "Real-World Projects",
    description: "Learn and build on production-grade projects, not synthetic assignments.",
  },
  {
    Icon: Users,
    title: "Mentor-Led Growth",
    description: "Work closely with senior engineers who guide you at every step.",
  },
  {
    Icon: ShieldCheck,
    title: "Certified & Verified",
    description: "Issue verifiable certificates with unique reference numbers for every program.",
  },
  {
    Icon: Headset,
    title: "Continuous Support",
    description: "Ongoing software support and career guidance even after the program ends.",
  },
];

export default function Features() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built for outcomes, designed for people"
          description="Every engagement is structured around measurable results — for our clients, our trainees and our interns."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <div className="group h-full rounded-2xl border border-navy-100 bg-linear-to-b from-white to-navy-50/50 p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                <span className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-tech-400 shadow-lg shadow-navy-950/20 transition-all duration-300 group-hover:bg-tech-500 group-hover:text-navy-950">
                  <feature.Icon className="size-7" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-bold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
