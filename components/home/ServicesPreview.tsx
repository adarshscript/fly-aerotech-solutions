import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { getServices } from "@/lib/content";

export default async function ServicesPreview() {
  const services = await getServices();

  return (
    <section className="section-padding bg-navy-50/60">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Software & technology services, end to end"
          description="Specialised domains covering the full software lifecycle — from ideation and development to training and long-term support."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 60}>
              <article className="group h-full rounded-2xl border border-navy-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-tech-500/40 hover:shadow-xl hover:shadow-tech-500/10">
                <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-tech-400 transition-all duration-300 group-hover:bg-tech-500 group-hover:text-navy-950">
                  <ServiceIcon name={service.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{service.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-tech-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
