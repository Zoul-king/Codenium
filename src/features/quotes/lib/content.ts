import { quoteInfrastructureOptions, quoteModules } from "@/lib/mocks";

export const quoteSections = [
  {
    key: "project",
    title: "Categoria",
    description: "Elige la base principal del proyecto."
  },
  {
    key: "objective",
    title: "Objetivo",
    description: "Que quieres lograr o que problema necesitas resolver?"
  },
  {
    key: "infrastructure",
    title: "Infraestructura",
    description: "Define si partimos desde cero, sobre base existente o con arquitectura distribuida."
  },
  {
    key: "timeline",
    title: "Tiempo aproximado",
    description: "Selecciona el rango de tiempo en el que te gustaria mover el proyecto."
  },
  {
    key: "features",
    title: "Capacidades complementarias",
    description: "Suma las funciones que quieres incluir desde el arranque."
  }
] as const;

export function getSelectedQuoteModules(moduleKeys: string[]) {
  return quoteModules.filter((item) => moduleKeys.includes(item.key));
}

export function getInfrastructureLabel(infrastructure: string) {
  return quoteInfrastructureOptions.find((item) => item.key === infrastructure)?.label ?? "Sin definir";
}

export function getQuoteSectionSummary(
  sectionKey: (typeof quoteSections)[number]["key"],
  draft: { objective: string; infrastructure: string; timelinePreference: string; modules: string[] }
) {
  if (sectionKey === "project") {
    return "Selecciona una base clara para tu estimado.";
  }

  if (sectionKey === "objective") {
    return draft.objective.trim() ? draft.objective.trim() : "Aun no escribes el objetivo del proyecto.";
  }

  if (sectionKey === "infrastructure") {
    return draft.infrastructure ? getInfrastructureLabel(draft.infrastructure) : "Pendiente";
  }

  if (sectionKey === "timeline") {
    if (!draft.timelinePreference) return "Pendiente";
    if (draft.timelinePreference === "1-4") return "Entre 1 y 4 meses.";
    if (draft.timelinePreference === "5-7") return "Entre 5 y 7 meses.";
    return "Entre 8 y 12 meses.";
  }

  const selectedModules = getSelectedQuoteModules(draft.modules);
  const items = selectedModules.filter((item) => item.group === "feature");

  if (items.length === 0) {
    return "Sin funciones adicionales por ahora.";
  }

  if (items.length === 1) {
    return items[0].label;
  }

  return `${items.length} elementos seleccionados`;
}
