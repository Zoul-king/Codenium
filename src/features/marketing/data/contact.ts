import { site } from "@/features/marketing/data/site";
import type { FaqItem, MarketingPageData } from "@/features/marketing/types";

export const contactPage: MarketingPageData = {
  slug: "/contact",
  headerVariant: "white",
  meta: {
    title: "Contacto - Codenium",
    description: "Habla con Codenium y revisa las preguntas frecuentes sobre nuestros servicios y la forma en que trabajamos."
  },
  hero: {
    kind: "image",
    title: "Contacto y",
    accent: "preguntas frecuentes",
    body: "Si tienes dudas sobre el proceso, el alcance o la mejor forma de comenzar, aqui puedes resolverlas y contactarnos.",
    image: site.assets.hero.contact
  }
};

export const faqs: FaqItem[] = [
  {
    question: "Que tipo de software pueden desarrollar para mi empresa?",
    answer: "Desarrollamos soluciones personalizadas, incluyendo aplicaciones web, moviles y sistemas empresariales, siempre partiendo de los procesos reales de tu negocio."
  },
  {
    question: "Como puedo contratar una consultoria tecnologica con ustedes?",
    answer: "Solo contactanos por el sitio o por telefono y programaremos una reunion para entender objetivos, retos y alcances antes de proponerte un plan."
  },
  {
    question: "Que beneficios tiene contar con profesionales a disposicion?",
    answer: "Te permite sumar experiencia tecnica especializada sin ampliar tu nomina fija, reduciendo tiempos de ejecucion y riesgo operativo."
  },
  {
    question: "Cual es la diferencia entre software estandar y software a medida?",
    answer: "El software estandar resuelve casos genericos. El software a medida se diseña para tus procesos, flujos y metas, con menos friccion y mas control."
  },
  {
    question: "Cuanto tiempo tarda el desarrollo de un software?",
    answer: "Depende del alcance y la complejidad. Antes de iniciar realizamos un analisis para definir tiempos realistas y una ruta de entregas claras."
  },
  {
    question: "Ofrecen mantenimiento y actualizaciones?",
    answer: "Si. Podemos acompanar el ciclo posterior al lanzamiento con soporte, mejoras de seguridad, ajustes evolutivos y monitoreo."
  },
  {
    question: "Puedo escalar mi software a futuro si mi empresa crece?",
    answer: "Si. Disenamos soluciones pensando en crecimiento, nuevas integraciones y mayor demanda para evitar rehacer el sistema demasiado pronto."
  },
  {
    question: "El software o servicio contratado tiene garantia?",
    answer: "Si. Cubrimos errores tecnicos atribuibles al desarrollo mientras la solucion se encuentre bajo nuestra administracion y el uso sea el esperado."
  }
];
