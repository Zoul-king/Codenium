import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const privacyPage: MarketingPageData = {
  slug: "/privacy",
  headerVariant: "white",
  meta: {
    title: "Aviso de privacidad - Codenium",
    description: "Espacio preparado para publicar el aviso de privacidad final de Codenium."
  },
  hero: {
    kind: "image",
    title: "Aviso de privacidad",
    body: "Espacio listo para sustituirse por el aviso de privacidad final sin romper la estructura del sitio.",
    image: site.assets.hero.contact
  }
};

export const privacyCopy = [
  "Este espacio esta preparado para integrar el aviso de privacidad definitivo de la empresa.",
  "La estructura ya quedo separada para poder reemplazar este contenido por texto legal real sin tocar componentes compartidos ni rutas publicas."
];
