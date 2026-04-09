import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const quotePage: MarketingPageData = {
  slug: "/quote",
  headerVariant: "white",
  meta: {
    title: "Cotizador - AxolotlCode",
    description: "Flujo inicial de cotizacion para estimar inversion y alcance de tu proyecto con AxolotlCode."
  },
  hero: {
    kind: "image",
    title: "Pre",
    accent: "cotizacion",
    body:
      "Responde unas cuantas preguntas para generar un estimado inicial y conectar esa informacion con nuestro flujo de contacto.",
    image: site.assets.hero.plans
  }
};
