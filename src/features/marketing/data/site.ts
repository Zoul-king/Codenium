import type { SiteConfig } from "@/features/marketing/types";

export const site: SiteConfig = {
  brand: {
    name: "AxolotlCode",
    short: "AX"
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y servicios", href: "/plans" },
    { label: "Cotizador", href: "/quote" },
    { label: "Acceso", href: "/login" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" }
  ],
  footerNav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y servicios", href: "/plans" },
    { label: "Cotizador", href: "/quote" },
    { label: "Acceso", href: "/login" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" },
    { label: "Aviso de privacidad", href: "/privacy" }
  ],
  contact: {
    location: "Estado de México",
    city: "Nezahualcóyotl",
    email: "admin@axolotlcode.tech",
    phone: "+(52) 56 2495 5086",
    phoneRaw: "+525624955086",
    whatsapp: "https://wa.link/ivbalm"
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/axolotl.code/", icon: "instagram" },
    { label: "X", href: "https://x.com/AxolotlCode", icon: "x" },
    { label: "Facebook", href: "https://www.facebook.com/Desarrollo.software.axolotlcode", icon: "facebook" },
    { label: "LinkedIn", href: "https://mx.linkedin.com/in/axolotl-code-86b85732a?trk=public_post_feed-actor-name", icon: "linkedin" },
    { label: "TikTok", href: "https://www.tiktok.com/@axolotl.code", icon: "tiktok" }
  ],
  footer: {
    body:
      "En AxolotlCode transformamos ideas en realidades digitales. Creamos aplicaciones innovadoras, seguras y personalizadas que impulsan tu negocio hacia el éxito.",
    legal: "© 2026 AxolotlCode. Todos los derechos reservados."
  },
  sticky: {
    message: "Contáctanos",
    label: "Por WhatsApp",
    href: "https://wa.link/ivbalm"
  },
  assets: {
    brand: {
      pink: "/images/brand/logo-pink.webp",
      white: "/images/brand/logo-white.webp"
    },
    hero: {
      home: "/images/marketing/hero-home.webp",
      about: "/images/marketing/hero-about.webp",
      plans: "/images/marketing/hero-plans.webp",
      contact: "/images/marketing/hero-contact.webp"
    },
    gallery: [
      "/images/marketing/gallery-1.webp",
      "/images/marketing/gallery-2.webp",
      "/images/marketing/gallery-3.webp",
      "/images/marketing/gallery-4.webp"
    ],
    about: {
      story: "/images/marketing/about-story.webp",
      company: "/images/marketing/company.webp"
    },
    faq: "/images/marketing/faq.webp",
    timeline: [
      "/images/marketing/timeline-1.webp",
      "/images/marketing/timeline-2.webp",
      "/images/marketing/timeline-3.webp",
      "/images/marketing/timeline-4.webp",
      "/images/marketing/timeline-5.webp",
      "/images/marketing/timeline-6.webp",
      "/images/marketing/timeline-7.webp"
    ],
    logos: {
      goser: "/images/brand/client-goser.svg",
      disver: "/images/brand/client-disver.png",
      client3: "/images/brand/client-3.png",
      client4: "/images/brand/client-4.png",
      aurumtage: "/images/brand/client-aurumtage.png",
      sittycia: "/images/brand/client-sittycia.png",
      nutritionLab: "/images/brand/client-nutrition-lab.png",
      larezza: "/images/brand/client-larezza.svg",
      masterClean: "/images/brand/client-master-clean.svg",
      valhui: "/images/brand/client-valhui.png",
      chessIq: "/images/portfolio/chess-iq-logo.png"
    }
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.1536937650258!2d-99.01649832596578!3d19.405764241539625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fd95427949d1%3A0xa5e068376bf62c07!2sCentro%20operativo%20Axolotlcode%2FDesarrollo%20de%20software!5e0!3m2!1ses!2smx!4v1754600848731!5m2!1ses!2smx"
};
