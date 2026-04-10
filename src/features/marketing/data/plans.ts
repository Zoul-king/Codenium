import { site } from "@/features/marketing/data/site";
import type { MarketingPageData, PlanCatalog } from "@/features/marketing/types";

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

export const pricingPlans: PlanCatalog = {
  personal: [
    {
      title: "Plan basico",
      price: "Pago inicial de $2,000 MXN",
      subtitle: "Mensualidad de $500 MXN",
      items: ["Landing page una sola vista", "Hosting incluido", "SEO basico onsite", "Cambios basicos ilimitados"]
    },
    {
      title: "Plan PYMES",
      price: "Pago inicial de $5,000 MXN",
      subtitle: "Mensualidad de $1,500 MXN",
      note: "Incluye todo lo del plan basico, mas:",
      items: ["Dos a tres vistas internas", "SEO avanzado onsite", "Control de clientes", "Cambios avanzados con limite mensual"]
    },
    {
      title: "Plan E-commerce",
      price: "Pago inicial de $10,000 MXN",
      subtitle: "Mensualidad de $2,500 MXN",
      note: "Incluye todo lo del plan PYMES, mas:",
      items: ["Sitio web con tienda", "Control de clientes", "Administracion de productos", "Integracion de pasarelas de pago"]
    },
    {
      title: "Plan personalizado",
      price: "Contactanos para discutir un presupuesto.",
      items: ["Consultoria personalizada"]
    }
  ],
  business: [
    {
      title: "Starter corporativo",
      price: "Pago inicial de $18,000 MXN",
      subtitle: "Mensualidad de $4,500 MXN",
      items: ["Sitio institucional multi-area", "Panel comercial base", "Gobierno de contenidos", "Acompanamiento operativo inicial"]
    },
    {
      title: "Operations board",
      price: "Pago inicial de $38,000 MXN",
      subtitle: "Mensualidad de $8,500 MXN",
      note: "Incluye tablero ejecutivo y lectura operativa:",
      items: ["Dashboards por rol", "Reportes exportables", "Integraciones clave", "Soporte de continuidad comercial"]
    },
    {
      title: "Suite commerce enterprise",
      price: "Pago inicial de $65,000 MXN",
      subtitle: "Mensualidad de $14,000 MXN",
      note: "Pensado para operaciones con varios equipos:",
      items: ["Checkout y catalogo avanzado", "Inventario y perfiles internos", "Automatizaciones comerciales", "Acompañamiento premium de implementacion"]
    },
    {
      title: "Plataforma corporativa a medida",
      price: "Cotizacion ejecutiva personalizada.",
      items: ["Discovery de arquitectura", "Roadmap por fases", "PM dedicado", "Entregables y soporte premium"]
    }
  ]
};
