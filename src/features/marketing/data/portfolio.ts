import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PortfolioCard } from "@/features/marketing/types";

export const portfolioPage: MarketingPageData = {
  slug: "/portfolio",
  headerVariant: "pink",
  meta: {
    title: "Portafolio - AxolotlCode",
    description:
      "Seleccionamos algunos de los proyectos de AxolotlCode para mostrar el tipo de soluciones que desarrollamos."
  },
  hero: {
    kind: "portfolio",
    title: "Proyectos",
    body:
      "Aquí encontrarás una selección de proyectos en los que AxolotlCode ha trabajado, desde desarrollos web hasta aplicaciones móviles. Cada proyecto refleja nuestra dedicación por crear soluciones digitales innovadoras."
  }
};

export const portfolioCards: PortfolioCard[] = [
  {
    name: "Sittycia",
    year: "2025",
    description:
      "Plataforma inteligente para monitorear vehículos y peatones en tiempo real, generando reportes y visualizaciones para la toma de decisiones.",
    tags: ["Monitoreo", "Vehículos", "Peatones", "Reportes", "Datos"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.sittycia,
    href: "https://www.axolotlcode.tech/portfolio/sittycia"
  },
  {
    name: "ValHui",
    year: "2025",
    description:
      "Sitio web, marketing digital e infraestructura de red para una empresa dedicada a la renta de espacios e inmuebles privados.",
    tags: ["Inmuebles", "Sitio web", "Marketing", "Infraestructura"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.valhui,
    href: "https://www.axolotlcode.tech/portfolio/valhui"
  },
  {
    name: "Chess IQ",
    year: "2025",
    description:
      "Plataforma para seguimiento y gestión de cobranza bancaria, optimizando recuperación de cartera con análisis de datos.",
    tags: ["Cobranza", "Pagos", "Cartera", "Datos"],
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.chessIq,
    href: "https://www.axolotlcode.tech/portfolio/chess-iq"
  },
  {
    name: "Nutrition Lab",
    year: "2025",
    description:
      "Landing informativa con plataforma de videos sobre nutrición, entrenamiento y herramientas para ejercitarse.",
    tags: ["Nutrición", "Videos", "Educación", "Salud"],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.nutritionLab,
    href: "https://www.axolotlcode.tech/portfolio/nutrition-lab"
  },
  {
    name: "Larezza",
    year: "2025",
    description:
      "Landing page y campañas de marketing digital para una marca especializada en masajes faciales.",
    tags: ["Landing", "Marketing", "Bienestar"],
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.larezza,
    href: "https://www.axolotlcode.tech/portfolio/larezza"
  },
  {
    name: "Master Clean",
    year: "2025",
    description:
      "Landing moderna y adquisición digital para una empresa de limpieza profesional orientada a clientes corporativos.",
    tags: ["Landing", "Marketing", "Servicios"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.masterClean,
    href: "https://www.axolotlcode.tech/portfolio/master-clean"
  },
  {
    name: "Aurumtage",
    year: "2025",
    description:
      "Integración con procesadores de pago para mejorar flujos de cobro, pagos y experiencia de usuario.",
    tags: ["Fintech", "Pagos", "Integración"],
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.aurumtage,
    href: "https://www.axolotlcode.tech/portfolio/aurumtage"
  },
  {
    name: "Disver Uniformes",
    year: "2025",
    description:
      "Ecommerce para venta y personalización de uniformes dirigido a empresas, escuelas y negocios.",
    tags: ["Ecommerce", "Uniformes", "Venta online"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.disver,
    href: "https://www.axolotlcode.tech/portfolio/disver-uniformes"
  }
];
