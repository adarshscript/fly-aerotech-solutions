import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(15_201_139/0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(22_58_117/0.5),transparent_60%)]"
        aria-hidden
      />
      <Container className="relative py-20 sm:py-24">
        <Badge className="mb-5">{eyebrow}</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">{description}</p>
        ) : null}
      </Container>
      <div className="relative h-20 bg-linear-to-b from-transparent to-white" aria-hidden />
    </section>
  );
}
