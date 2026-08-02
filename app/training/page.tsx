import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Clock, MapPin, PlayCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { getTrainingPrograms } from "@/lib/content";
import { images } from "@/lib/images";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training",
  description: `Hands-on, industry-aligned training programs by ${site.name} for students and professionals.`,
};

export default async function TrainingPage() {
  const trainingPrograms = await getTrainingPrograms();

  return (
    <>
      <PageHeader
        eyebrow="Training Programs"
        title="Practical, mentor-led training that builds real skills"
        description="Our programs combine guided curriculum, live projects and continuous support — online, offline or hybrid."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Programs"
            title="Choose your learning path"
            description="Each program is delivered by working engineers and capped at small batch sizes for personal attention."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingPrograms.map((program, index) => (
              <Reveal key={program.title} delay={index * 70}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/5">
                  <div className="relative overflow-hidden">
                    <Image
                      src={program.image ?? images.training}
                      alt={program.title}
                      width={600}
                      height={400}
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 to-transparent" aria-hidden />
                    <div className="absolute bottom-4 left-5 flex flex-wrap gap-2">
                      <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white">
                        <Clock className="size-3.5" aria-hidden /> {program.duration}
                      </span>
                      <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white">
                        <MapPin className="size-3.5" aria-hidden /> {program.mode}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-tech-600 uppercase">
                        {program.level}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-navy-900">{program.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{program.description}</p>
                    <ul className="mt-4 space-y-2">
                      {program.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="size-4 shrink-0 text-tech-500" aria-hidden />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex-1" />
                    <a
                      href={`mailto:${site.email}?subject=${encodeURIComponent(
                        `Enquiry — ${program.title} (${site.name})`
                      )}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition-all hover:border-tech-500 hover:text-tech-600"
                    >
                      <PlayCircle className="size-4" aria-hidden /> Enquire Now
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-navy-50/60">
        <Container className="text-center">
          <SectionHeading
            eyebrow="Not sure where to start?"
            title="Talk to our training team"
            description="Tell us your goal and current skill level — we&rsquo;ll recommend the right path."
          />
          <Button href="/contact" size="lg">
            Get a Training Plan
          </Button>
        </Container>
      </section>
    </>
  );
}
