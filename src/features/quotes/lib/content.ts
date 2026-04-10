import { quoteModules } from "@/lib/mocks";

export const quoteSections = [
  {
    key: "project",
    title: "Categoría",
    description: "Elige la base principal del proyecto."
  },
  {
    key: "objective",
    title: "Objetivo",
    description: "¿Qué quieres lograr o qué problema necesitas resolver?"
  },
  {
    key: "timeline",
    title: "Tiempo aproximado",
    description: "Selecciona el rango de tiempo en el que te gustaría mover el proyecto."
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

export function getQuoteSectionSummary(
  sectionKey: (typeof quoteSections)[number]["key"],
  draft: { projectType: string; objective: string; timelinePreference: string; modules: string[] }
) {
  if (sectionKey === "project") {
    return "Selecciona una base clara para tu estimado.";
  }

  if (sectionKey === "objective") {
    return draft.objective.trim() ? draft.objective.trim() : "Aun no escribes el objetivo del proyecto.";
  }

  if (sectionKey === "timeline") {
    if (draft.timelinePreference === "1-4") return "Entre 1 y 4 meses.";
    if (draft.timelinePreference === "5-7") return "Entre 5 y 7 meses.";
    return "Entre 8 y 12 meses.";
  }

  const selectedModules = getSelectedQuoteModules(draft.modules);
  const items = selectedModules.filter((item) => item.group === (sectionKey === "features" ? "feature" : "service"));

  if (items.length === 0) {
    return sectionKey === "features" ? "Sin funciones adicionales por ahora." : "Sin soporte posterior por ahora.";
  }

  if (items.length === 1) {
    return items[0].label;
  }

  return `${items.length} elementos seleccionados`;
}
