import type { SiteConfig } from "@/features/marketing/types";

export const site: SiteConfig = {
  brand: {
    name: "Codenium",
    short: "CD"
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y servicios", href: "/plans" },
    { label: "Cotizador", href: "/quote" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" }
  ],
  footerNav: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y servicios", href: "/plans" },
    { label: "Cotizador", href: "/quote" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" }
  ],
  contact: {
    location: "Texcoco",
    city: "Estado de México",
    email: "cotizaciones@codenium.nth-solutions.com.mx",
    phone: "56 43 46 10 37",
    phoneRaw: "+525643461037",
    whatsapp: "https://wa.me/525643461037",
    assistantLabel: "FrancIA",
    assistantHref: "/contact"
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { label: "X", href: "https://x.com/", icon: "x" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" }
  ],
  footer: {
    body: "Diseñamos software, dashboards y productos digitales con una estructura clara, sobria y orientada a resolver procesos reales.",
    legal: "© 2026 Techina. Todos los derechos reservados."
  },
  sticky: {
    message: "Canales de contacto",
    label: "Abrir herramientas",
    href: "/contact"
  },
  assets: {
    brand: {
      header: "/images/brand/logo-header.png",
      footer: "/images/brand/logo-footer.png"
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
    faq: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
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
  mapEmbedUrl: "https://www.google.com/maps?q=Universidad%20Polit%C3%A9cnica%20de%20Texcoco%2C%20Texcoco%2C%20Estado%20de%20M%C3%A9xico&z=15&output=embed"
};