import { site } from "@/features/marketing/data/site";
import type { BenefitItem, ClientLogo, MarketingPageData, ServiceItem } from "@/features/marketing/types";

export const homePage: MarketingPageData = {
  slug: "/",
  headerVariant: "brand",
  meta: {
    title: "Codenium - Software, plataformas y experiencias digitales",
    description: "Diseñamos sitios, plataformas y productos digitales con estimado inicial y seguimiento claro durante el proceso."
  },
  hero: {
    kind: "home",
    title: "Software y plataformas a tu medida",
    body: "Diseñamos y desarrollamos productos digitales con un proceso más claro desde el inicio: estimado inicial, continuidad comercial y seguimiento en cada etapa.",
    primaryCta: { label: "Conocer más", href: "/about" },
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
    title: "Consultorías",
    body: "Acompañamiento estratégico para ordenar decisiones, alcance y prioridades digitales.",
    icon: "consulting"
  },
  {
    title: "Profesionales a tu disposición",
    body: "Talento especializado para reforzar equipos y acelerar iniciativas clave.",
    icon: "team"
  },
  {
    title: "Desarrollo a la medida",
    body: "Productos pensados para tu operación, tu negocio y el nivel de detalle que necesitas.",
    icon: "spark"
  },
  {
    title: "Soporte técnico",
    body: "Continuidad, mantenimiento y resolución ágil para mantener tu operación en movimiento.",
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
  { title: "Estimación inicial clara", body: "Sin sorpresas, presupuesto aterrizado desde el primer día." },
  { title: "Panel de seguimiento propio", body: "Control total sobre el avance de tu proyecto en tiempo real." },
  { title: "Acompañamiento continuo", body: "Asesoría constante para tomar las mejores decisiones digitales." },
  { title: "Comunicación centralizada", body: "Toda la conversación y archivos en un solo lugar seguro." },
  { title: "Entregables visibles", body: "Hitos claros con resultados tangibles en cada etapa." },
  { title: "Prioridades aterrizadas", body: "Enfoque en lo que realmente genera valor para tu negocio." }
];


