import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import Button from "@/components/ui/Button";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: `Software, web development, support, R&D, training, internships and consulting services by ${site.name}.`,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Technology services for every stage of growth"
        description="From a single feature to a full product — and from first-time learners to enterprise teams."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Service Catalogue"
            title="Nine specialised service lines"
            description="Every service is delivered by a single accountable team with one quality standard."
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
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-navy-900">
        <Container className="text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Have a project in mind? <span className="text-gradient">Let&rsquo;s build it.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-navy-100 sm:text-base">
              Reach out and we&rsquo;ll respond within one business day.
            </p>
            <Button href="/contact" size="lg" className="mt-8">
              Start a Project <ArrowRight className="size-4" aria-hidden />
            </Button>
            <p className="mt-6 flex items-center justify-center gap-2 font-mono text-xs text-navy-200">
              <Mail className="size-4 text-tech-400" aria-hidden /> {site.email}
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
