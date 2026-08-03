import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/data";

export default function StatsBand() {
  return (
    <section className="relative z-10 -mt-14 pb-4">
      <Container>
        <Reveal>
          <div className="glass-card grid grid-cols-2 gap-4 rounded-3xl px-5 py-6 sm:gap-6 sm:px-10 sm:py-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                  <span className="text-gradient">{stat.value}</span>
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
