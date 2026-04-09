import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PlanItem, ServiceItem } from "@/features/marketing/types";

export const plansPage: MarketingPageData = {
  slug: "/plans",
  headerVariant: "white",
  meta: {
    title: "Planes y servicios - AxolotlCode",
    description:
      "Explora los servicios y planes de AxolotlCode para impulsar tu negocio con soluciones digitales flexibles."
  },
  hero: {
    kind: "image",
    title: "Planes y",
    accent: "servicios",
    body:
      "Descubre nuestras soluciones diseñadas para adaptarse a tus necesidades. Ofrecemos servicios personalizados para llevar tus proyectos al siguiente nivel, con planes flexibles y opciones que se ajustan a cada etapa de tu crecimiento.",
    image: site.assets.hero.plans
  }
};

export const planServices: ServiceItem[] = [
  {
    title: "Desarrollo de software",
    body: "Creamos plataformas y sistemas escalables alineados con la operación de tu negocio.",
    icon: "code"
  },
  {
    title: "Consultorías",
    body: "Acompañamiento técnico y estratégico para acelerar decisiones con menos riesgo.",
    icon: "consulting"
  },
  {
    title: "Talento especializado",
    body: "Integramos perfiles técnicos para reforzar tu equipo cuando más lo necesitas.",
    icon: "team"
  },
  {
    title: "Producto a la medida",
    body: "Diseñamos herramientas que responden a procesos reales y objetivos concretos.",
    icon: "spark"
  },
  {
    title: "Soporte técnico",
    body: "Mantenemos tus sistemas estables, seguros y listos para seguir creciendo.",
    icon: "support"
  },
  {
    title: "Incubación",
    body: "Ayudamos a nuevas iniciativas a validar, lanzar y evolucionar sus productos digitales.",
    icon: "idea"
  }
];

export const pricingPlans: PlanItem[] = [
  {
    title: "Plan básico",
    price: "Pago inicial de $2,000 MXN",
    subtitle: "Mensualidad de $500 MXN",
    items: [
      "Landing page one-page",
      "Hosting",
      "SEO básico onsite",
      "Cambios básicos ilimitados"
    ]
  },
  {
    title: "Plan pymes",
    price: "Pago inicial de $5,000 MXN",
    subtitle: "Mensualidad de $1,500 MXN",
    note: "Incluye todo lo del plan básico, más:",
    items: [
      "Dos a tres vistas internas",
      "SEO avanzado onsite",
      "Control de clientes",
      "Cambios avanzados con límite mensual"
    ]
  },
  {
    title: "Plan e-commerce",
    price: "Pago inicial de $10,000 MXN",
    subtitle: "Mensualidad de $2,500 MXN",
    note: "Incluye todo lo del plan pymes, más:",
    items: [
      "Sitio web con tienda",
      "Control de clientes",
      "Administración de productos",
      "Integración de pasarelas de pago"
    ]
  }
];
