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
    body: "Descubre soluciones pensadas para distintas etapas de crecimiento, con una estructura clara y opciones fáciles de comparar.",
    image: site.assets.hero.plans
  }
};

export const planServices: ServiceItem[] = [
  {
    title: "Corrección de errores",
    body: "Resolución ágil de fallos técnicos en plataformas existentes para asegurar su estabilidad y rendimiento óptimo.",
    icon: "code"
  },
  {
    title: "Continuación de proyectos",
    body: "Retomamos y escalamos desarrollos pausados o incompletos con una arquitectura sólida y visión de futuro.",
    icon: "consulting"
  },
  {
    title: "Mantenimiento",
    body: "Acompañamiento preventivo y evolutivo para que tu software nunca deje de funcionar y se mantenga actualizado.",
    icon: "support"
  },
  {
    title: "Servicio personalizado",
    body: "Soluciones a medida para necesidades específicas que requieren un enfoque único fuera de los planes estándar.",
    icon: "spark"
  }
];

export const pricingPlans: PlanItem[] = [
  {
    title: "Plan básico",
    price: "Pago inicial de $2,000 MXN",
    subtitle: "Mensualidad de $500 MXN",
    items: ["Landing page una sola vista", "Hosting incluido", "SEO básico onsite", "Cambios básicos ilimitados"]
  },
  {
    title: "Plan PYMES",
    price: "Pago inicial de $5,000 MXN",
    subtitle: "Mensualidad de $1,500 MXN",
    note: "Incluye todo lo del plan básico, más:",
    items: ["Dos a tres vistas internas", "SEO avanzado onsite", "Control de clientes", "Cambios avanzados con límite mensual"]
  },
  {
    title: "Plan E-commerce",
    price: "Pago inicial de $10,000 MXN",
    subtitle: "Mensualidad de $2,500 MXN",
    note: "Incluye todo lo del plan PYMES, más:",
    items: ["Sitio web con tienda", "Control de clientes", "Administración de productos", "Integración de pasarelas de pago"]
  }
];

