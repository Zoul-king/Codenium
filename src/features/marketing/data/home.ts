import { site } from "@/features/marketing/data/site";
import type { BenefitItem, ClientLogo, MarketingPageData, ServiceItem } from "@/features/marketing/types";

export const homePage: MarketingPageData = {
  slug: "/",
  headerVariant: "brand",
  meta: {
    title: "Codenium - Software, plataformas y experiencias digitales",
    description: "Disenamos sitios, plataformas y productos digitales con estimado inicial y seguimiento claro durante el proceso."
  },
  hero: {
    kind: "home",
    title: "Software y plataformas a tu medida",
    body: "Disenamos y desarrollamos productos digitales con un proceso mas claro desde el inicio: estimado inicial, continuidad comercial y seguimiento en cada etapa.",
    primaryCta: { label: "Sobre nosotros", href: "/about" },
    secondaryCta: { label: "Obtener estimado", href: "/quote" }
  }
};

export const services: ServiceItem[] = [
  {
    title: "Desarrollo de software",
    body: "Aplicaciones y sistemas hechos para resolver procesos reales y crecer contigo.",
    icon: "code"
  },
  {
    title: "Consultorias",
    body: "Acompanamiento estrategico para ordenar decisiones, alcance y prioridades digitales.",
    icon: "consulting"
  },
  {
    title: "Profesionales a tu disposicion",
    body: "Talento especializado para reforzar equipos y acelerar iniciativas clave.",
    icon: "team"
  },
  {
    title: "Desarrollo a la medida",
    body: "Productos pensados para tu operacion, tu negocio y el nivel de detalle que necesitas.",
    icon: "spark"
  },
  {
    title: "Soporte tecnico",
    body: "Continuidad, mantenimiento y resolucion agil para mantener tu operacion en movimiento.",
    icon: "support"
  },
  {
    title: "Incubadora",
    body: "Aterrizamos ideas digitales con una base clara para validarlas y construirlas bien.",
    icon: "idea"
  }
];

export const clientLogos: ClientLogo[] = [
  { alt: "Facebook" },
  { alt: "Instagram" },
  { alt: "Snapchat" },
  { alt: "Twitter" },
  { alt: "LinkedIn" },
  { alt: "Notion" },
  { alt: "Shopify" },
  { alt: "Slack" }
];

export const benefits: BenefitItem[] = [
  { title: "Proceso mas claro", body: "Empezamos con un estimado inicial aterrizado." },
  { title: "Seguimiento continuo", body: "Mantienes visibilidad durante cada etapa." },
  { title: "Soluciones utiles", body: "Disenamos para negocio, operacion y crecimiento." }
];
