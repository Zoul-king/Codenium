import type { MarketingPageData } from "@/features/marketing/types";

export const privacyPage: MarketingPageData = {
  slug: "/privacy",
  headerVariant: "pink",
  meta: {
    title: "Aviso de privacidad - AxolotlCode",
    description: "Espacio preparado para publicar el aviso de privacidad final de AxolotlCode."
  },
  hero: {
    kind: "portfolio",
    title: "Aviso de privacidad",
    body: "Espacio listo para sustituirse por el aviso de privacidad final sin romper la estructura del sitio."
  }
};

export const privacyCopy = [
  "Este espacio está preparado para integrar el aviso de privacidad definitivo de la empresa.",
  "La estructura ya quedó separada para poder reemplazar este contenido por texto legal real sin tocar componentes compartidos ni rutas públicas."
];
