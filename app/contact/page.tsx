import type { Metadata } from "next";
import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ui/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} for software development, training, internships and technology consulting.`,
};

const contactCards = [
  {
    Icon: Mail,
    label: "Email Us",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    Icon: MapPin,
    label: "Our Location",
    value: site.location,
    href: undefined,
  },
  {
    Icon: ShieldCheck,
    label: "MSME Registration",
    value: site.msme,
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let&rsquo;s talk about your next project or program"
        description="Questions about our services, training or internships? Drop us a message — we typically reply within one business day."
      />

      <section className="section-padding">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {contactCards.map((card, index) => (
              <Reveal key={card.label} delay={index * 80}>
                <a
                  href={card.href}
                  className={`flex h-full flex-col items-center rounded-2xl border border-navy-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5 ${
                    card.href ? "" : "cursor-default"
                  }`}
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-tech-400">
                    <card.Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-navy-900">{card.label}</h3>
                  <p className="mt-1.5 break-all text-sm text-slate-600">{card.value}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-sm sm:p-10">
                <SectionHeading align="left" eyebrow="Send a Message" title="We&rsquo;d love to hear from you" className="mb-8" />
                <ContactForm />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-navy-900 shadow-sm">
                <div className="p-8 sm:p-10">
                  <h3 className="text-xl font-bold text-white">Find us in Vadodara</h3>
                  <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-navy-100">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-tech-400" aria-hidden />
                    {site.location} — we welcome project discussions, walk-in enquiries and campus visits.
                  </p>
                  <p className="mt-5 flex items-center gap-3 text-sm text-navy-100">
                    <Clock className="size-4 shrink-0 text-tech-400" aria-hidden />
                    Business hours: Monday to Saturday
                  </p>
                </div>
                <div className="relative mt-auto h-64 bg-navy-950">
                  <iframe
                    title={`${site.name} — location map`}
                    src="https://www.google.com/maps?q=Vadodara,+Gujarat,+India&output=embed"
                    className="h-full w-full border-0 opacity-90 saturate-50"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
