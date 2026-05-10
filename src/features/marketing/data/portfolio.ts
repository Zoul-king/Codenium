import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PortfolioCard } from "@/features/marketing/types";

export const portfolioPage: MarketingPageData = {
  slug: "/portfolio",
  headerVariant: "white",
  meta: {
    title: "Portafolio - Codenium",
    description: "Una seleccion de proyectos que muestra como traducimos necesidades reales en productos digitales claros, utiles y listos para crecer."
  },
  hero: {
    kind: "image",
    title: "Portfolio",
    body: "Casos donde convertimos procesos complejos en productos mas claros, utiles y sostenibles.",
    image: site.assets.hero.home
  }
};

export const portfolioCards: PortfolioCard[] = [
  {
    name: "Sittycia",
    year: "2025",
    description: "Monitoreo con dashboards y reportes para tomar decisiones con mas contexto.",
    tags: ["Monitoreo", "Reportes", "Tiempo real"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.sittycia,
    href: "https://sittycia.com/"
  },
  {
    name: "ValHui",
    year: "2025",
    description: "Sitio comercial enfocado en ordenar oferta, confianza y captacion.",
    tags: ["Sitio web", "Leads", "Inmobiliario"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.valhui,
    href: "https://valhui.com/"
  },
  {
    name: "Chess IQ",
    year: "2025",
    description: "Seguimiento de cartera con visibilidad operativa y lectura rapida.",
    tags: ["Cobranza", "Operacion", "Datos"],
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.chessIq,
    href: "https://chessiq.app/"
  },
  {
    name: "Nutrition Lab",
    year: "2025",
    description: "Experiencia educativa con mejor estructura de contenido y servicios.",
    tags: ["Contenido", "Educacion", "Video"],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.nutritionLab,
    href: "https://nutrition-lab.mx/"
  },
  {
    name: "Larezza",
    year: "2025",
    description: "Landing y campanas para mejorar percepcion, foco y conversion.",
    tags: ["Landing", "Marca", "Conversion"],
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.larezza,
    href: "https://larezza.mx/"
  },
  {
    name: "Master Clean",
    year: "2025",
    description: "Sitio comercial orientado a clientes corporativos con estructura mas clara.",
    tags: ["Servicios", "Empresas", "Captacion"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.masterClean,
    href: "https://masterclean.mx/"
  },
  {
    name: "Aurumtage",
    year: "2025",
    description: "Integracion de pagos para simplificar cobro y experiencia de usuario.",
    tags: ["Fintech", "Pagos", "Integraciones"],
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.aurumtage,
    href: "https://aurumtage.com/"
  },
  {
    name: "Disver Uniformes",
    year: "2025",
    description: "Ecommerce listo para crecer en catalogo, pedidos y atencion comercial.",
    tags: ["Ecommerce", "Catalogo", "Pedidos"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    logo: site.assets.logos.disver,
    href: "https://disveruniformes.com.mx/"
  }
];
