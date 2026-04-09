import { quoteModules } from "@/lib/mocks";

export const quoteSections = [
  {
    key: "project",
    title: "Configuración principal",
    description: "Define el tipo de proyecto para calcular una base inicial."
  },
  {
    key: "features",
    title: "Capacidades complementarias",
    description: "Suma las funciones que quieres incorporar desde el arranque."
  },
  {
    key: "services",
    title: "Acompañamiento opcional",
    description: "Agrega soporte recurrente o continuidad mensual si lo necesitas."
  }
] as const;

export function getSelectedQuoteModules(moduleKeys: string[]) {
  return quoteModules.filter((item) => moduleKeys.includes(item.key));
}

export function getQuoteSectionSummary(sectionKey: (typeof quoteSections)[number]["key"], draft: { projectType: string; modules: string[] }) {
  if (sectionKey === "project") {
    return "Selecciona una base clara para tu estimado.";
  }

  const selectedModules = getSelectedQuoteModules(draft.modules);
  const items = selectedModules.filter((item) => item.group === (sectionKey === "features" ? "feature" : "service"));

  if (items.length === 0) {
    return sectionKey === "features" ? "Sin funcionalidades adicionales por ahora." : "Sin acompañamiento mensual por ahora.";
  }

  if (items.length === 1) {
    return items[0].label;
  }

  return `${items.length} elementos seleccionados`;
}
