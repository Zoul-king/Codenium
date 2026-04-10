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
    primaryCta: { label: "Conocer mas", href: "/about" },
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
    title: "Seguimiento",
    body: "Un panel centralizado para monitorear el avance del proyecto, validar hitos y mantener visibles los siguientes pasos.",
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
    title: "Cotizacion preliminar",
    body: "Usa el cotizador para aterrizar alcance, infraestructura y una lectura inicial del proyecto antes de avanzar.",
    icon: "idea"
  }
];

export const clientLogos: ClientLogo[] = [
  { alt: "Google", src: "https://logo.clearbit.com/google.com", href: "https://www.google.com" },
  { alt: "Microsoft", src: "https://logo.clearbit.com/microsoft.com", href: "https://www.microsoft.com" },
  { alt: "Amazon", src: "https://logo.clearbit.com/amazon.com", href: "https://www.amazon.com" },
  { alt: "GitHub", src: "https://logo.clearbit.com/github.com", href: "https://github.com" },
  { alt: "Slack", src: "https://logo.clearbit.com/slack.com", href: "https://slack.com" },
  { alt: "Stripe", src: "https://logo.clearbit.com/stripe.com", href: "https://stripe.com" },
  { alt: "Shopify", src: "https://logo.clearbit.com/shopify.com", href: "https://www.shopify.com" },
  { alt: "Notion", src: "https://logo.clearbit.com/notion.so", href: "https://www.notion.so" },
  { alt: "Codenium Footer", src: "/images/brand/codenium-footer.svg" },
  { alt: "Codenium Header", src: "/images/brand/codenium-header.svg" },
  { alt: "Codenium Footer", src: "/images/brand/codenium-footer.svg" },
  { alt: "Codenium Header", src: "/images/brand/codenium-header.svg" },
  { alt: "Codenium Footer", src: "/images/brand/codenium-footer.svg" },
  { alt: "Codenium Header", src: "/images/brand/codenium-header.svg" }
];

export const benefits: BenefitItem[] = [
  { title: "Estimacion inicial clara", body: "Sin sorpresas, presupuesto aterrizado desde el primer dia." },
  { title: "Panel de seguimiento propio", body: "Control total sobre el avance de tu proyecto en tiempo real." },
  { title: "Acompanamiento continuo", body: "Asesoria constante para tomar las mejores decisiones digitales." },
  { title: "Comunicacion centralizada", body: "Toda la conversacion y archivos en un solo lugar seguro." },
  { title: "Entregables visibles", body: "Hitos claros con resultados tangibles en cada etapa." }
];
