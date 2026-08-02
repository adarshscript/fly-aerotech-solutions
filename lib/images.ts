export const images = {
  logo: "/logo.jpg",
  favicon: "/favicon.png",
  hero: "/hero1.jpg",
  heroSlides: ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"],
  about: "/team1.jpg",
  training: "/course1.jpg",
  team: ["/team1.jpg"],
  teamMembers: ["/team/team-1.jpg", "/team/team-2.jpg", "/team/team-3.jpg"],
  gallery: ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg"],
  courses: ["/course1.jpg", "/course2.jpg"],
  services: ["/service1.jpg", "/service2.jpg", "/service3.jpg"],
} as const;

export type ImageKey = keyof typeof images;
