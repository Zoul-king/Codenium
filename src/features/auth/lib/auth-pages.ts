import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const loginPage: MarketingPageData = {
  slug: "/login",
  headerVariant: "white",
  meta: {
    title: "Acceso - AxolotlCode",
    description: "Accede a tu espacio mock dentro de AxolotlCode."
  },
  hero: {
    kind: "image",
    title: "Acceso",
    accent: "mock",
    body: "Ingresa con una cuenta simulada para revisar la base de dashboards y el flujo preparado para autenticación real.",
    image: site.assets.hero.contact
  }
};

export const registerPage: MarketingPageData = {
  slug: "/register",
  headerVariant: "white",
  meta: {
    title: "Registro - AxolotlCode",
    description: "Registro público mock para cuentas cliente dentro del ecosistema de AxolotlCode."
  },
  hero: {
    kind: "image",
    title: "Crear cuenta",
    accent: "cliente",
    body: "El registro público está reservado para clientes. Más adelante se conectará con autenticación y persistencia reales.",
    image: site.assets.hero.plans
  }
};

export const forgotPasswordPage: MarketingPageData = {
  slug: "/forgot-password",
  headerVariant: "white",
  meta: {
    title: "Recuperar acceso - AxolotlCode",
    description: "Vista mock para recuperación de contraseña preparada para futura conexión real."
  },
  hero: {
    kind: "image",
    title: "Recuperar",
    accent: "acceso",
    body: "Esta vista ya deja el flujo visual listo para integrarse con envío real de correos y validación de tokens más adelante.",
    image: site.assets.hero.contact
  }
};
