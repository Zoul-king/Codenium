import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const loginPage: MarketingPageData = {
  slug: "/login",
  headerVariant: "white",
  meta: {
    title: "Acceso - Codenium",
    description: "Ingresa para revisar cotizaciones, proyectos y seguimiento."
  },
  hero: {
    kind: "image",
    title: "Acceso",
    accent: "directo",
    body: "Ingresa con tu correo y continúa con tus proyectos, cotizaciones y mensajes.",
    image: site.assets.hero.contact
  }
};

export const registerPage: MarketingPageData = {
  slug: "/register",
  headerVariant: "white",
  meta: {
    title: "Registro - Codenium",
    description: "Crea tu cuenta cliente para dar seguimiento a tus solicitudes."
  },
  hero: {
    kind: "image",
    title: "Crear cuenta",
    accent: "cliente",
    body: "Abre tu cuenta para continuar solicitudes, revisar avances y mantener todo en un solo lugar.",
    image: site.assets.hero.plans
  }
};

export const forgotPasswordPage: MarketingPageData = {
  slug: "/forgot-password",
  headerVariant: "white",
  meta: {
    title: "Recuperar acceso - Codenium",
    description: "Solicita instrucciones para volver a entrar a tu cuenta."
  },
  hero: {
    kind: "image",
    title: "Recuperar",
    accent: "acceso",
    body: "Déjanos tu correo y te mostraremos el siguiente paso para volver a entrar.",
    image: site.assets.hero.contact
  }
};

export const resetPasswordPage: MarketingPageData = {
  slug: "/reset-password",
  headerVariant: "white",
  meta: {
    title: "Restablecer contraseña - Codenium",
    description: "Define una nueva contraseña para tu cuenta de Codenium."
  },
  hero: {
    kind: "image",
    title: "Restablecer",
    accent: "contraseña",
    body: "Define una nueva contraseña y vuelve a entrar a tu cuenta.",
    image: site.assets.hero.contact
  }
};
