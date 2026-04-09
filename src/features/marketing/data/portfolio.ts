import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PortfolioCard } from "@/features/marketing/types";

export const portfolioPage: MarketingPageData = {
  slug: "/portfolio",
  headerVariant: "brand",
  meta: {
    title: "Portafolio - AxolotlCode",
    description: "Una selección de proyectos que muestra cómo traducimos necesidades reales en productos digitales claros, útiles y listos para crecer."
  },
  hero: {
    kind: "portfolio",
    title: "Portafolio",
    body: "Explora proyectos donde combinamos estrategia, producto y ejecución para resolver procesos, ventas, operación y seguimiento."
  }
};

export const portfolioCards: PortfolioCard[] = [
  {
    name: "Sittycia",
    year: "2025",
    description: "Plataforma de monitoreo con reportes y visualizaciones para entender mejor el flujo de vehículos y peatones en tiempo real.",
    tags: ["Monitoreo", "Reportes", "Datos", "Tiempo real"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.sittycia,
    href: "https://www.axolotlcode.tech/portfolio/sittycia"
  },
  {
    name: "ValHui",
    year: "2025",
    description: "Sitio comercial con acompañamiento digital para ordenar la oferta, mostrar inmuebles y facilitar el contacto con prospectos.",
    tags: ["Sitio web", "Leads", "Infraestructura", "Marketing"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.valhui,
    href: "https://www.axolotlcode.tech/portfolio/valhui"
  },
  {
    name: "Chess IQ",
    year: "2025",
    description: "Plataforma para dar seguimiento a cobranza y cartera con mejor visibilidad operativa y apoyo para la toma de decisiones.",
    tags: ["Cobranza", "Seguimiento", "Datos", "Operación"],
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.chessIq,
    href: "https://www.axolotlcode.tech/portfolio/chess-iq"
  },
  {
    name: "Nutrition Lab",
    year: "2025",
    description: "Experiencia educativa con contenido en video, recursos de acompañamiento y una base pensada para ampliar servicios digitales.",
    tags: ["Contenido", "Educación", "Video", "Bienestar"],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.nutritionLab,
    href: "https://www.axolotlcode.tech/portfolio/nutrition-lab"
  },
  {
    name: "Larezza",
    year: "2025",
    description: "Landing y campañas para presentar una marca con más claridad, elevar percepción y convertir mejor desde el primer contacto.",
    tags: ["Landing", "Marca", "Campañas", "Conversión"],
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.larezza,
    href: "https://www.axolotlcode.tech/portfolio/larezza"
  },
  {
    name: "Master Clean",
    year: "2025",
    description: "Sitio comercial orientado a clientes corporativos, con estructura más clara para servicios, confianza y adquisición digital.",
    tags: ["Servicios", "Landing", "Empresas", "Captación"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.masterClean,
    href: "https://www.axolotlcode.tech/portfolio/master-clean"
  },
  {
    name: "Aurumtage",
    year: "2025",
    description: "Integración con pagos para mejorar flujos de cobro y simplificar la experiencia del usuario dentro de procesos críticos.",
    tags: ["Fintech", "Pagos", "Integraciones", "Experiencia"],
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.aurumtage,
    href: "https://www.axolotlcode.tech/portfolio/aurumtage"
  },
  {
    name: "Disver Uniformes",
    year: "2025",
    description: "Ecommerce para venta y personalización de uniformes con una base lista para crecer en catálogo, pedidos y atención comercial.",
    tags: ["Ecommerce", "Catálogo", "Pedidos", "Venta online"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.disver,
    href: "https://www.axolotlcode.tech/portfolio/disver-uniformes"
  }
];
