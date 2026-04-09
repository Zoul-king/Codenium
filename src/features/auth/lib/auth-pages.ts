import { site } from "@/features/marketing/data/site";
import type { MarketingPageData } from "@/features/marketing/types";

export const loginPage: MarketingPageData = {
  slug: "/login",
  headerVariant: "white",
  meta: {
    title: "Acceso - AxolotlCode",
    description: "Ingresa a tu espacio para revisar cotizaciones, proyectos y seguimiento."
  },
  hero: {
    kind: "image",
    title: "Acceso",
    accent: "seguro",
    body: "Ingresa con tu correo y contraseña para continuar con tu seguimiento dentro de AxolotlCode.",
    image: site.assets.hero.contact
  }
};

export const registerPage: MarketingPageData = {
  slug: "/register",
  headerVariant: "white",
  meta: {
    title: "Registro - AxolotlCode",
    description: "Crea tu cuenta cliente para dar seguimiento a cotizaciones, proyectos y mensajes."
  },
  hero: {
    kind: "image",
    title: "Crear cuenta",
    accent: "cliente",
    body: "Abre tu cuenta para centralizar tu información, dar seguimiento a tus solicitudes y mantener la comunicación en un solo lugar.",
    image: site.assets.hero.plans
  }
};

export const forgotPasswordPage: MarketingPageData = {
  slug: "/forgot-password",
  headerVariant: "white",
  meta: {
    title: "Recuperar acceso - AxolotlCode",
    description: "Solicita instrucciones para recuperar el acceso a tu cuenta."
  },
  hero: {
    kind: "image",
    title: "Recuperar",
    accent: "acceso",
    body: "Déjanos tu correo y te mostraremos el siguiente paso para volver a entrar a tu cuenta.",
    image: site.assets.hero.contact
  }
};
