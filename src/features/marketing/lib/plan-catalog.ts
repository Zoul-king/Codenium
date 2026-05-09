import type { PlanCatalog, PlanItem } from "@/features/marketing/types";
import type { PlanProfile } from "@/lib/types/domain";

export interface ManagedPlanRecord {
  id: string;
  profile: PlanProfile;
  title: string;
  items: string[];
  note?: string;
  customPriceLabel?: string;
  setupFee: number | null;
  monthlyFee: number | null;
  discountPercentage: number;
  active: boolean;
}

export interface PersistedPlanConfig {
  id: string;
  profile: PlanProfile;
  setupFee: number | null;
  monthlyFee: number | null;
  discountPercentage: number;
  active: boolean;
}

export type ManagedPlanCatalog = Record<PlanProfile, ManagedPlanRecord[]>;

export const defaultManagedPlans: ManagedPlanCatalog = {
  personal: [
    {
      id: "personal-plan-basico",
      profile: "personal",
      title: "Plan basico",
      setupFee: 2000,
      monthlyFee: 500,
      discountPercentage: 0,
      active: true,
      items: ["Landing page una sola vista", "Hosting incluido", "SEO basico onsite", "Cambios basicos ilimitados"]
    },
    {
      id: "personal-plan-pymes",
      profile: "personal",
      title: "Plan PYMES",
      setupFee: 5000,
      monthlyFee: 1500,
      discountPercentage: 0,
      active: true,
      note: "Incluye todo lo del plan basico, mas:",
      items: ["Dos a tres vistas internas", "SEO avanzado onsite", "Control de clientes", "Cambios avanzados con limite mensual"]
    },
    {
      id: "personal-plan-ecommerce",
      profile: "personal",
      title: "Plan E-commerce",
      setupFee: 10000,
      monthlyFee: 2500,
      discountPercentage: 0,
      active: true,
      note: "Incluye todo lo del plan PYMES, mas:",
      items: ["Sitio web con tienda", "Control de clientes", "Administracion de productos", "Integracion de pasarelas de pago"]
    },
    {
      id: "personal-plan-personalizado",
      profile: "personal",
      title: "Plan personalizado",
      setupFee: null,
      monthlyFee: null,
      discountPercentage: 0,
      active: true,
      customPriceLabel: "Contactanos para discutir un presupuesto.",
      items: ["Consultoria personalizada"]
    }
  ],
  business: [
    {
      id: "business-starter-corporativo",
      profile: "business",
      title: "Starter corporativo",
      setupFee: 18000,
      monthlyFee: 4500,
      discountPercentage: 0,
      active: true,
      items: ["Sitio institucional multi-area", "Panel comercial base", "Gobierno de contenidos", "Acompanamiento operativo inicial"]
    },
    {
      id: "business-operations-board",
      profile: "business",
      title: "Operations board",
      setupFee: 38000,
      monthlyFee: 8500,
      discountPercentage: 0,
      active: true,
      note: "Incluye tablero ejecutivo y lectura operativa:",
      items: ["Dashboards por rol", "Reportes exportables", "Integraciones clave", "Soporte de continuidad comercial"]
    },
    {
      id: "business-suite-commerce-enterprise",
      profile: "business",
      title: "Suite commerce enterprise",
      setupFee: 65000,
      monthlyFee: 14000,
      discountPercentage: 0,
      active: true,
      note: "Pensado para operaciones con varios equipos:",
      items: ["Checkout y catalogo avanzado", "Inventario y perfiles internos", "Automatizaciones comerciales", "Acompanamiento premium de implementacion"]
    },
    {
      id: "business-plataforma-a-medida",
      profile: "business",
      title: "Plataforma corporativa a medida",
      setupFee: null,
      monthlyFee: null,
      discountPercentage: 0,
      active: true,
      customPriceLabel: "Cotizacion ejecutiva personalizada.",
      items: ["Discovery de arquitectura", "Roadmap por fases", "PM dedicado", "Entregables y soporte premium"]
    }
  ]
};

export function buildManagedPlanCatalog(source: ManagedPlanCatalog): PlanCatalog {
  return {
    personal: source.personal.filter((plan) => plan.active).map(toPlanItem),
    business: source.business.filter((plan) => plan.active).map(toPlanItem)
  };
}

export function cloneManagedPlanCatalog(source: ManagedPlanCatalog): ManagedPlanCatalog {
  return {
    personal: source.personal.map((plan) => ({ ...plan, items: [...plan.items] })),
    business: source.business.map((plan) => ({ ...plan, items: [...plan.items] }))
  };
}

export function mergeManagedPlanCatalog(configs: PersistedPlanConfig[] = []) {
  return {
    personal: applyPlanConfigs(defaultManagedPlans.personal, configs),
    business: applyPlanConfigs(defaultManagedPlans.business, configs)
  } satisfies ManagedPlanCatalog;
}

export async function fetchManagedPlanCatalog() {
  if (typeof window === "undefined") {
    return cloneManagedPlanCatalog(defaultManagedPlans);
  }

  const response = await fetch("/api/plans", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los planes.");
  }

  return mergeManagedPlanCatalogFromUnknown(await response.json());
}

export async function saveManagedPlanCatalog(plans: ManagedPlanCatalog) {
  const response = await fetch("/api/plans", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(plans)
  });

  if (!response.ok) {
    throw new Error("No se pudieron guardar los planes.");
  }

  return mergeManagedPlanCatalogFromUnknown(await response.json());
}

function mergeManagedPlanCatalogFromUnknown(value: unknown) {
  if (!value || typeof value !== "object") {
    return cloneManagedPlanCatalog(defaultManagedPlans);
  }

  return {
    personal: normalizePlanArray((value as { personal?: unknown }).personal, defaultManagedPlans.personal),
    business: normalizePlanArray((value as { business?: unknown }).business, defaultManagedPlans.business)
  } satisfies ManagedPlanCatalog;
}

function applyPlanConfigs(basePlans: ManagedPlanRecord[], configs: PersistedPlanConfig[]) {
  return basePlans.map((plan) => {
    const config = configs.find((item) => item.id === plan.id);

    return {
      ...plan,
      setupFee: normalizeMoney(config?.setupFee, plan.setupFee),
      monthlyFee: normalizeMoney(config?.monthlyFee, plan.monthlyFee),
      discountPercentage: normalizeDiscount(config?.discountPercentage, plan.discountPercentage),
      active: typeof config?.active === "boolean" ? config.active : plan.active
    };
  });
}

function normalizePlanArray(value: unknown, fallback: ManagedPlanRecord[]) {
  if (!Array.isArray(value)) {
    return cloneManagedPlanCatalog({ personal: fallback, business: [] as ManagedPlanRecord[] }).personal;
  }

  return fallback.map((basePlan) => {
    const candidate = value.find((item) => item && typeof item === "object" && (item as { id?: string }).id === basePlan.id);

    if (!candidate || typeof candidate !== "object") {
      return { ...basePlan, items: [...basePlan.items] };
    }

    const normalizedCandidate = candidate as Partial<ManagedPlanRecord>;

    return {
      ...basePlan,
      active: typeof normalizedCandidate.active === "boolean" ? normalizedCandidate.active : basePlan.active,
      discountPercentage: normalizeDiscount(normalizedCandidate.discountPercentage, basePlan.discountPercentage),
      setupFee: normalizeMoney(normalizedCandidate.setupFee, basePlan.setupFee),
      monthlyFee: normalizeMoney(normalizedCandidate.monthlyFee, basePlan.monthlyFee)
    };
  });
}

function normalizeMoney(value: unknown, fallback: number | null) {
  if (value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return Math.round(value);
}

function normalizeDiscount(value: unknown, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyPlanTextOverrides(
  catalog: ManagedPlanCatalog,
  overrides: Record<string, { title?: string; note?: string; customPriceLabel?: string; items?: string[] }>
): ManagedPlanCatalog {
  const apply = (plans: ManagedPlanRecord[]) =>
    plans.map((plan) => {
      const override = overrides[plan.id];
      if (!override) return { ...plan, items: [...plan.items] };
      return {
        ...plan,
        title: typeof override.title === "string" && override.title ? override.title : plan.title,
        note: typeof override.note === "string" ? override.note || undefined : plan.note,
        customPriceLabel:
          typeof override.customPriceLabel === "string"
            ? override.customPriceLabel || undefined
            : plan.customPriceLabel,
        items: Array.isArray(override.items) && override.items.length > 0
          ? [...override.items]
          : [...plan.items]
      };
    });
  return { personal: apply(catalog.personal), business: apply(catalog.business) };
}

function toPlanItem(plan: ManagedPlanRecord): PlanItem {
  const discountMultiplier = 1 - plan.discountPercentage / 100;
  const nextSetup = plan.setupFee === null ? null : Math.max(0, Math.round(plan.setupFee * discountMultiplier));
  const nextMonthly = plan.monthlyFee === null ? null : Math.max(0, Math.round(plan.monthlyFee * discountMultiplier));

  return {
    id: plan.id,
    title: plan.title,
    price: plan.customPriceLabel ?? buildPriceLabel(nextSetup),
    subtitle: buildSubtitleLabel(nextMonthly),
    note: plan.discountPercentage > 0 ? `Descuento temporal del ${plan.discountPercentage}% aplicado.` : plan.note,
    items: [...plan.items],
    active: plan.active,
    discountPercentage: plan.discountPercentage,
    originalPrice: plan.customPriceLabel ?? buildPriceLabel(plan.setupFee)
  };
}

function buildPriceLabel(value: number | null) {
  return value === null ? "Cotizacion personalizada." : `Pago inicial de ${formatCurrency(value)} MXN`;
}

function buildSubtitleLabel(value: number | null) {
  return value === null ? undefined : `Mensualidad de ${formatCurrency(value)} MXN`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  })
    .format(value)
    .replace("MXN", "")
    .trim();
}
