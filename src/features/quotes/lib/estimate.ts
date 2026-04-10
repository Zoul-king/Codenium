import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteEstimate, QuoteModuleKey } from "@/lib/types/domain";

function sumModuleRange<T extends "price" | "monthly">(modules: QuoteModuleKey[], key: T) {
  return modules.reduce(
    (accumulator, moduleKey) => {
      const module = quoteModules.find((item) => item.key === moduleKey);
      const range = module?.[key];

      if (!range) {
        return accumulator;
      }

      return {
        min: accumulator.min + range.min,
        max: accumulator.max + range.max
      };
    },
    { min: 0, max: 0 }
  );
}

function sumTimeline(modules: QuoteModuleKey[]) {
  return modules.reduce(
    (accumulator, moduleKey) => {
      const module = quoteModules.find((item) => item.key === moduleKey);
      const range = module?.timelineWeeks;

      if (!range) {
        return accumulator;
      }

      return {
        min: accumulator.min + range.min,
        max: accumulator.max + range.max
      };
    },
    { min: 0, max: 0 }
  );
}

export function calculateQuoteEstimate(draft: QuoteDraft): QuoteEstimate {
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const buildModules = draft.modules.filter((item) => item !== "maintenance");
  const buildRange = sumModuleRange(buildModules, "price");
  const monthlyRange = sumModuleRange(draft.modules, "monthly");
  const timelineRange = sumTimeline(buildModules);
  if (!projectType || !draft.infrastructure) {
    return {
      build: { min: 0, max: 0 },
      monthly: monthlyRange,
      timelineWeeks: { min: 0, max: 0 }
    };
  }

  const infrastructureRange =
    draft.infrastructure === "new"
      ? { build: { min: 6000, max: 12000 }, timeline: { min: 1, max: 2 } }
      : draft.infrastructure === "existing"
        ? { build: { min: 2000, max: 6000 }, timeline: { min: 0, max: 1 } }
        : draft.infrastructure === "cloud"
          ? { build: { min: 9000, max: 22000 }, timeline: { min: 1, max: 3 } }
          : { build: { min: 12000, max: 26000 }, timeline: { min: 2, max: 4 } };

  return {
    build: {
      min: projectType.base.min + buildRange.min + infrastructureRange.build.min,
      max: projectType.base.max + buildRange.max + infrastructureRange.build.max
    },
    monthly: monthlyRange,
    timelineWeeks: {
      min: projectType.timelineWeeks.min + timelineRange.min + infrastructureRange.timeline.min,
      max: projectType.timelineWeeks.max + timelineRange.max + infrastructureRange.timeline.max
    }
  };
}

export function getQuoteViability(draft: QuoteDraft, estimate: QuoteEstimate) {
  if (!draft.projectType || !draft.infrastructure || !draft.timelinePreference) {
    return {
      tone: "pending" as const,
      label: "Pendiente",
      description: "Completa las variables principales para leer viabilidad con mas precision."
    };
  }

  const featureCount = draft.modules.filter((item) => item !== "maintenance").length;
  const timelineMax = estimate.timelineWeeks.max;
  const buildMax = estimate.build.max;
  const expectedTimelineMax = draft.timelinePreference === "1-4" ? 16 : draft.timelinePreference === "5-7" ? 28 : 48;

  if (buildMax <= 70000 && timelineMax <= 8 && featureCount <= 3 && timelineMax <= expectedTimelineMax) {
    return {
      tone: "favorable" as const,
      label: "Favorable",
      description: "El alcance esta bien acotado y se puede avanzar con una definicion relativamente rapida."
    };
  }

  if (buildMax <= 140000 && timelineMax <= 14 && featureCount <= 6 && timelineMax <= expectedTimelineMax) {
    return {
      tone: "media" as const,
      label: "Media",
      description: "El proyecto es viable, pero conviene priorizar modulos y revisar dependencias antes de cerrar tiempos."
    };
  }

  return {
    tone: "complex" as const,
    label: "Compleja",
    description: "El alcance combina varias piezas criticas o el tiempo deseado es muy agresivo para el nivel de complejidad actual."
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}
