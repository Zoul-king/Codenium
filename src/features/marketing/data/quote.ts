import type { MarketingPageData } from "@/features/marketing/types";

export const quotePage: MarketingPageData = {
  slug: "/quote",
  headerVariant: "white",
  meta: {
    title: "Cotizador - Codenium",
    description: "Obten un estimado inicial y continua con una solicitud mas clara."
  },
  hero: {
    kind: "image",
    title: "Estimado",
    accent: "inicial",
    body: "Define categoria, objetivo, tiempo y capacidades para revisar un rango orientativo antes de continuar.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80"
  }
};
