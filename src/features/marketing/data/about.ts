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
    title: "Investigación y contexto",
    body: "Leemos el escenario completo para entender objetivos, tensiones operativas y lo que realmente vale la pena resolver primero."
  },
  {
    title: "Planificación",
    body: "Aterrizamos alcance, entregables y decisiones clave para que el proyecto tenga una ruta clara desde el inicio."
  },
  {
    title: "Diseño y prototipos",
    body: "Traducimos la estrategia en pantallas, recorridos y prototipos que vuelven la idea tangible antes de construir."
  },
  {
    title: "Contenido",
    body: "Ordenamos mensajes, piezas y estructura para que el producto comunique con claridad y sin ruido."
  },
  {
    title: "Desarrollo Frontend y Backend",
    body: "Construimos una base tecnica solida para operar, escalar y mantener el producto con criterio."
  },
  {
    title: "Pruebas y despliegue",
    body: "Probamos, afinamos detalles y liberamos con control para que la salida a produccion no dependa de improvisar."
  },
  {
    title: "Mantenimiento y evolución",
    body: "Seguimos iterando con base en uso real, nuevas necesidades y oportunidades de mejora sostenida."
  }
];
