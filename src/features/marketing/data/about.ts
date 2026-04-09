import { site } from "@/features/marketing/data/site";
import type { AboutBlock, MarketingPageData, TimelineStep } from "@/features/marketing/types";

export const aboutPage: MarketingPageData = {
  slug: "/about",
  headerVariant: "white",
  meta: {
    title: "Sobre nosotros - AxolotlCode",
    description:
      "Conoce la historia, misión y visión de AxolotlCode y cómo construimos soluciones tecnológicas para empresas."
  },
  hero: {
    kind: "image",
    title: "Sobre",
    accent: "nosotros",
    body:
      "En AxolotlCode, nuestra pasión por la innovación y el desarrollo digital nos impulsa a construir soluciones que transforman ideas en realidades tecnológicas.",
    image: site.assets.hero.about
  }
};

export const story = [
  "AxolotlCode nació con la misión de transformar las ideas de nuestros clientes en soluciones tecnológicas de alto impacto. Desde nuestros inicios, hemos priorizado la innovación, la calidad y la seguridad en cada proyecto, trabajando con un equipo comprometido y apasionado.",
  "A lo largo de nuestra trayectoria, hemos ayudado a empresas de diversos sectores a modernizar sus procesos y alcanzar sus objetivos en un mundo digital en constante evolución. Nos enorgullece ser aliados estratégicos en la transformación tecnológica de nuestros clientes."
];

export const missionVision: AboutBlock[] = [
  {
    title: "Misión",
    body:
      "Desarrollamos tecnología con sello mexicano, creando soluciones innovadoras que transforman vidas y elevan el potencial de personas, empresas y comunidades."
  },
  {
    title: "Visión",
    body:
      "Ser una empresa tecnológica mexicana reconocida a nivel mundial por la calidad de sus soluciones, su capacidad de innovar y un ambiente laboral que promueve el crecimiento individual del equipo."
  }
];

export const timeline: TimelineStep[] = [
  {
    title: "Investigación y recopilación de información",
    body: "Descubrimos contigo lo que necesitas y cómo podemos lograrlo."
  },
  {
    title: "Planificación",
    body: "Estructuramos tus ideas con mapa del sitio, wireframes y alcances claros."
  },
  {
    title: "Diseño y prototipos",
    body: "Creamos propuestas visuales que reflejan tu visión de negocio."
  },
  {
    title: "Contenido",
    body: "Damos voz a tu sitio con textos e imágenes alineados con tus objetivos."
  },
  {
    title: "Desarrollo frontend y backend",
    body: "Construimos tu producto para que funcione sólido y se vea impecable."
  },
  {
    title: "Pruebas y despliegue",
    body: "Ajustamos los detalles finales para un lanzamiento sin sobresaltos."
  },
  {
    title: "Mantenimiento y evolución",
    body: "Acompañamos el crecimiento de tu sitio con soporte y mejoras continuas."
  }
];
