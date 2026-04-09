import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const quotePage: MarketingPageData = {
  slug: "/quote",
  headerVariant: "white",
  meta: {
    title: "Cotizador - AxolotlCode",
    description: "Genera un estimado inicial para tu proyecto y continúa con una solicitud más precisa."
  },
  hero: {
    kind: "image",
    title: "Estimado",
    accent: "inicial",
    body: "Cuéntanos qué quieres construir, elige lo que necesitas y revisa un rango orientativo antes de enviarnos tu solicitud.",
    image: site.assets.hero.plans
  }
};
