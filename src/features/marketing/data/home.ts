import { site } from "@/features/marketing/data/site";
import type { BenefitItem, ClientLogo, MarketingPageData, ServiceItem } from "@/features/marketing/types";

export const homePage: MarketingPageData = {
  slug: "/",
  headerVariant: "brand",
  meta: {
    title: "AxolotlCode - Software, plataformas y experiencias digitales",
    description: "Diseñamos sitios, plataformas y productos digitales con estimado inicial y seguimiento claro durante el proceso."
  },
  hero: {
    kind: "home",
    title: "Software y plataformas a tu medida",
    body: "Diseñamos y desarrollamos productos digitales con un proceso más claro desde el inicio: estimado inicial, continuidad comercial y seguimiento en cada etapa.",
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
  { src: site.assets.logos.goser, href: "https://goser.mx/", alt: "Goser" },
  { src: site.assets.logos.disver, href: "https://disveruniformes.com.mx/", alt: "Disver Uniformes" },
  { src: site.assets.logos.client3, alt: "Cliente 3" },
  { src: site.assets.logos.client4, alt: "Cliente 4" },
  { src: site.assets.logos.aurumtage, href: "https://aurumtage.com/", alt: "Aurumtage" },
  { src: site.assets.logos.sittycia, href: "https://sittycia.com/", alt: "Sittycia" },
  { src: site.assets.logos.nutritionLab, href: "https://nutrition-lab.mx/", alt: "Nutrition Lab" },
  { src: site.assets.logos.larezza, href: "https://larezza.com/", alt: "Larezza" },
  { src: site.assets.logos.masterClean, href: "https://masterclean.mx/", alt: "Master Clean" },
  { src: site.assets.logos.valhui, href: "https://valhui.com/", alt: "Valhui" }
];

export const benefits: BenefitItem[] = [
  { title: "Proceso más claro", body: "Empezamos con un estimado inicial aterrizado." },
  { title: "Seguimiento continuo", body: "Mantienes visibilidad durante cada etapa." },
  { title: "Soluciones útiles", body: "Diseñamos para negocio, operación y crecimiento." }
];
