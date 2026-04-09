import { quoteModules } from "@/lib/mocks";

export const quoteSteps = [
  { key: "project", label: "Cuéntanos qué quieres construir", helper: "Elige el tipo de proyecto que más se parece a tu idea." },
  { key: "modules", label: "Elige lo que necesitas", helper: "Suma funcionalidades y servicios según el alcance que tienes en mente." },
  { key: "summary", label: "Revisa tu estimado inicial", helper: "Te mostramos un rango orientativo antes de pedir tus datos." },
  { key: "contact", label: "Déjanos tus datos", helper: "Comparte tu información para continuar con una propuesta más precisa." }
] as const;

export const quoteModuleGroups = [
  {
    key: "feature",
    label: "Funcionalidades del proyecto",
    description: "Todo lo que formará parte del producto desde el arranque."
  },
  {
    key: "service",
    label: "Acompañamiento opcional",
    description: "Servicios recurrentes o de continuidad que puedes sumar desde el inicio."
  }
] as const;

export function getSelectedQuoteModules(moduleKeys: string[]) {
  return quoteModules.filter((item) => moduleKeys.includes(item.key));
}
