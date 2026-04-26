import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PlanCatalog, ServicePricingItem } from "@/features/marketing/types";
import { buildManagedPlanCatalog, defaultManagedPlans } from "@/features/marketing/lib/plan-catalog";

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

export const pricingPlans: PlanCatalog = buildManagedPlanCatalog(defaultManagedPlans);

export const servicesPricing: ServicePricingItem[] = [
  {
    title: "Servicio de mantenimiento",
    price: "Pago inicial de $2,500 MXN",
    subtitle: "Mensualidad de $900 MXN",
    description: "Mantenimiento preventivo y correctivo para conservar estabilidad, aplicar ajustes menores y dar continuidad operativa."
  },
  {
    title: "Servicios de arreglo de funcionalidad existente",
    price: "Pago inicial de $4,500 MXN",
    subtitle: "Mensualidad de $1,500 MXN",
    description: "Correccion de modulos, flujos o pantallas que hoy generan friccion para recuperar continuidad sin rehacer el proyecto completo."
  },
  {
    title: "Servicios de optimizacion",
    price: "Pago inicial de $6,000 MXN",
    subtitle: "Mensualidad de $2,000 MXN",
    description: "Mejoras iterativas en rendimiento, experiencia y conversion para productos que necesitan evolucionar sin perder estabilidad."
  }
];
