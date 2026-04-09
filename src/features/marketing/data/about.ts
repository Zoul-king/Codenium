import { site } from "@/features/marketing/data/site";
import type { AboutBlock, MarketingPageData, TimelineStep } from "@/features/marketing/types";

export const aboutPage: MarketingPageData = {
  slug: "/about",
  headerVariant: "white",
  meta: {
    title: "Sobre nosotros - Codenium",
    description: "Conoce la historia, mision y vision de Codenium y como construimos soluciones tecnologicas para empresas."
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
  "Codenium empezo desde cero, como un proyecto propio construido con esfuerzo, aprendizaje constante y la necesidad de demostrar que una buena ejecucion cambia el resultado de un negocio.",
  "Cada etapa exigio resolver mejor, trabajar con mas criterio y crecer desde la disciplina. Esa historia hoy define nuestra forma de disenar, desarrollar y acompanar productos digitales."
];

export const missionVision: AboutBlock[] = [
  {
    title: "Mision",
    body: "Construir software y plataformas utiles, claras y bien ejecutadas para ayudar a empresas a operar mejor, decidir mejor y crecer con una base mas solida."
  },
  {
    title: "Vision",
    body: "Ser una empresa tecnologica mexicana reconocida a nivel mundial por la calidad de sus soluciones, su capacidad de evolucionar y una cultura de trabajo exigente pero humana."
  }
];

export const timeline: TimelineStep[] = [
  {
    title: "Investigacion y contexto",
    body: "Entendemos el problema, el objetivo y las restricciones reales."
  },
  {
    title: "Planificacion",
    body: "Ordenamos alcance, entregables y decisiones de prioridad."
  },
  {
    title: "Diseno y prototipos",
    body: "Traducimos la estrategia en una experiencia entendible y util."
  },
  {
    title: "Contenido",
    body: "Aterrizamos mensajes, flujos y materiales para comunicar mejor."
  },
  {
    title: "Desarrollo frontend y backend",
    body: "Construimos una base solida para operar, crecer y mantener."
  },
  {
    title: "Pruebas y despliegue",
    body: "Pulimos detalles y salimos a produccion con control."
  },
  {
    title: "Mantenimiento y evolucion",
    body: "Seguimos mejorando el producto segun uso, datos y nuevas necesidades."
  }
];
