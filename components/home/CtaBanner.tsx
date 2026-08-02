import { ArrowRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export default function CtaBanner() {
  return (
    <section className="section-padding">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-center sm:px-14">
            <div className="bg-grid absolute inset-0" aria-hidden />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(15_201_139/0.2),transparent_60%)]"
              aria-hidden
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build, train or <span className="text-gradient">grow with us?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy-100 sm:text-base">
                Whether you need software, want to upskill, or are looking for an internship — let&rsquo;s start the
                conversation.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="/contact" size="lg">
                  Contact Us <Mail className="size-4" aria-hidden />
                </Button>
                <Button href="/training" variant="white" size="lg">
                  View Training <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>
              <p className="mt-6 font-mono text-xs text-navy-200">
                MSME Regd. <span className="text-tech-400">{site.msme}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
