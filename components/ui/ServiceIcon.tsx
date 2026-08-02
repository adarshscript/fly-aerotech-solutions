import {
  Briefcase,
  Code2,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  LifeBuoy,
  Lightbulb,
  Microscope,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  globe: Globe,
  layers: Layers,
  "life-buoy": LifeBuoy,
  flask: FlaskConical,
  microscope: Microscope,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
};

interface ServiceIconProps {
  name: string;
  className?: string;
}

export default function ServiceIcon({ name, className }: ServiceIconProps) {
  const Icon = iconMap[name] ?? Layers;
  return <Icon className={className} aria-hidden />;
}
