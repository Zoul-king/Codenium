import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PlanItem, ServiceItem } from "@/features/marketing/types";

export const plansPage: MarketingPageData = {
  slug: "/plans",
  headerVariant: "white",
  meta: {
    title: "Planes y servicios - Codenium",
    description: "Explora los servicios y planes de Codenium para impulsar tu negocio con soluciones digitales flexibles."
  },
  hero: {
    kind: "image",
    title: "Planes y",
    accent: "servicios",
    body: "Descubre soluciones pensadas para distintas etapas de crecimiento, con una estructura clara y opciones faciles de comparar.",
    image: site.assets.hero.plans
  }
};

export const planServices: ServiceItem[] = [
  {
    title: "Desarrollo de software",
    body: "Creamos plataformas y sistemas escalables alineados con la operacion de tu negocio.",
    icon: "code"
  },
  {
    title: "Consultorias",
    body: "Acompanamiento tecnico y estrategico para acelerar decisiones con menos riesgo.",
    icon: "consulting"
  },
  {
    title: "Talento especializado",
    body: "Integramos perfiles tecnicos para reforzar tu equipo cuando mas lo necesitas.",
    icon: "team"
  },
  {
    title: "Producto a la medida",
    body: "Disenamos herramientas que responden a procesos reales y objetivos concretos.",
    icon: "spark"
  },
  {
    title: "Soporte tecnico",
    body: "Mantenemos tus sistemas estables, seguros y listos para seguir creciendo.",
    icon: "support"
  },
  {
    title: "Incubacion",
    body: "Ayudamos a nuevas iniciativas a validar, lanzar y evolucionar sus productos digitales.",
    icon: "idea"
  }
];

export const pricingPlans: PlanItem[] = [
  {
    title: "Plan basico",
    price: "Pago inicial de $2,000 MXN",
    subtitle: "Mensualidad de $500 MXN",
    items: ["Landing page one-page", "Hosting", "SEO basico onsite", "Cambios basicos ilimitados"]
  },
  {
    title: "Plan pymes",
    price: "Pago inicial de $5,000 MXN",
    subtitle: "Mensualidad de $1,500 MXN",
    note: "Incluye todo lo del plan basico, mas:",
    items: ["Dos a tres vistas internas", "SEO avanzado onsite", "Control de clientes", "Cambios avanzados con limite mensual"]
  },
  {
    title: "Plan e-commerce",
    price: "Pago inicial de $10,000 MXN",
    subtitle: "Mensualidad de $2,500 MXN",
    note: "Incluye todo lo del plan pymes, mas:",
    items: ["Sitio web con tienda", "Control de clientes", "Administracion de productos", "Integracion de pasarelas de pago"]
  }
];
