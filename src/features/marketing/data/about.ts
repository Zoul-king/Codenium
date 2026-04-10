import { site } from "@/features/marketing/data/site";
import type { AboutBlock, MarketingPageData, TimelineStep } from "@/features/marketing/types";

export const aboutPage: MarketingPageData = {
  slug: "/about",
  headerVariant: "white",
  meta: {
    title: "Sobre nosotros - Codenium",
    description: "Conoce la historia, misión y visión de Codenium y cómo construimos soluciones tecnológicas para empresas."
  },
  hero: {
    kind: "image",
    title: "Sobre",
    accent: "nosotros",
    body: "Construimos productos digitales con foco en utilidad real, claridad operativa y crecimiento sostenible.",
    image: site.assets.hero.about
  }
};

export const story = [
  "Codenium empezó desde cero, como un proyecto propio construido con esfuerzo, aprendizaje constante y la necesidad de demostrar que una buena ejecución cambia el resultado de un negocio.",
  "Cada etapa exigió resolver mejor, trabajar con más criterio y crecer desde la disciplina. Esa historia hoy define nuestra forma de diseñar, desarrollar y acompañar productos digitales."
];

export const missionVision: AboutBlock[] = [
  {
    title: "Misión",
    body: "Construir software y plataformas útiles, claras y bien ejecutadas para ayudar a empresas a operar mejor, decidir mejor y crecer con una base más sólida."
  },
  {
    title: "Visión",
    body: "Ser una empresa tecnológica mexicana reconocida a nivel mundial por la calidad de sus soluciones, su capacidad de evolucionar y una cultura de trabajo exigente pero humana."
  }
];

export const timeline: TimelineStep[] = [
  {
    title: "Investigación y contexto",
    body: "Entendemos el problema, el objetivo y las restricciones reales."
  },
  {
    title: "Planificación",
    body: "Ordenamos alcance, entregables y decisiones de prioridad."
  },
  {
    title: "Diseño y prototipos",
    body: "Traducimos la estrategia en una experiencia entendible y útil."
  },
  {
    title: "Contenido",
    body: "Aterrizamos mensajes, flujos y materiales para comunicar mejor."
  },
  {
    title: "Desarrollo frontend y backend",
    body: "Construimos una base sólida para operar, crecer y mantener."
  },
  {
    title: "Pruebas y despliegue",
    body: "Pulimos detalles y salimos a producción con control."
  },
  {
    title: "Mantenimiento y evolución",
    body: "Seguimos mejorando el producto según uso, datos y nuevas necesidades."
  }
];

