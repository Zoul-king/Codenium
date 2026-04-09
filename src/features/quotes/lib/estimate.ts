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
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const buildModules = draft.modules.filter((item) => item !== "maintenance");
  const buildRange = sumModuleRange(buildModules, "price");
  const monthlyRange = sumModuleRange(draft.modules, "monthly");
  const timelineRange = sumTimeline(buildModules);

  return {
    build: {
      min: projectType.base.min + buildRange.min,
      max: projectType.base.max + buildRange.max
    },
    monthly: monthlyRange,
    timelineWeeks: {
      min: projectType.timelineWeeks.min + timelineRange.min,
      max: projectType.timelineWeeks.max + timelineRange.max
    }
  };
}

export function getQuoteViability(draft: QuoteDraft, estimate: QuoteEstimate) {
  const featureCount = draft.modules.filter((item) => item !== "maintenance").length;
  const timelineMax = estimate.timelineWeeks.max;
  const buildMax = estimate.build.max;

  if (buildMax <= 70000 && timelineMax <= 8 && featureCount <= 3) {
    return {
      tone: "favorable" as const,
      label: "Favorable",
      description: "El alcance está bien acotado y se puede avanzar con una definición relativamente rápida."
    };
  }

  if (buildMax <= 140000 && timelineMax <= 14 && featureCount <= 6) {
    return {
      tone: "media" as const,
      label: "Media",
      description: "El proyecto es viable, pero conviene priorizar módulos y revisar dependencias antes de cerrar tiempos."
    };
  }

  return {
    tone: "complex" as const,
    label: "Compleja",
    description: "El alcance combina varias piezas críticas. Necesita una definición más detallada para aterrizar fases y riesgos."
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}
