import { site } from "@/features/marketing/data/site";
import type { FaqItem, MarketingPageData } from "@/features/marketing/types";

export const contactPage: MarketingPageData = {
  slug: "/contact",
  headerVariant: "white",
  meta: {
    title: "Contacto - AxolotlCode",
    description: "Habla con AxolotlCode y revisa las preguntas frecuentes sobre nuestros servicios y la forma en que trabajamos."
  },
  hero: {
    kind: "image",
    title: "Contacto y",
    accent: "preguntas frecuentes",
    body: "Si tienes dudas sobre el proceso, el alcance o la mejor forma de comenzar, aquí puedes resolverlas y ponerte en contacto con nosotros.",
    image: site.assets.hero.contact
  }
};

export const faqs: FaqItem[] = [
  {
    question: "¿Qué tipo de software pueden desarrollar para mi empresa?",
    answer: "Desarrollamos soluciones personalizadas, incluyendo aplicaciones web, móviles y sistemas empresariales, siempre partiendo de los procesos reales de tu negocio."
  },
  {
    question: "¿Cómo puedo contratar una consultoría tecnológica con ustedes?",
    answer: "Solo contáctanos por el sitio o por teléfono y programaremos una reunión para entender objetivos, retos y alcances antes de proponerte un plan."
  },
  {
    question: "¿Qué beneficios tiene contar con profesionales a disposición?",
    answer: "Te permite sumar experiencia técnica especializada sin ampliar tu nómina fija, reduciendo tiempos de ejecución y riesgo operativo."
  },
  {
    question: "¿Cuál es la diferencia entre software estándar y software a medida?",
    answer: "El software estándar resuelve casos genéricos. El software a medida se diseña para tus procesos, flujos y metas, con menos fricción y más control."
  },
  {
    question: "¿Cuánto tiempo tarda el desarrollo de un software?",
    answer: "Depende del alcance y la complejidad. Antes de iniciar realizamos un análisis para definir tiempos realistas y una ruta de entregas claras."
  },
  {
    question: "¿Ofrecen mantenimiento y actualizaciones?",
    answer: "Sí. Podemos acompañar el ciclo posterior al lanzamiento con soporte, mejoras de seguridad, ajustes evolutivos y monitoreo."
  },
  {
    question: "¿Puedo escalar mi software a futuro si mi empresa crece?",
    answer: "Sí. Diseñamos soluciones pensando en crecimiento, nuevas integraciones y mayor demanda para evitar rehacer el sistema demasiado pronto."
  },
  {
    question: "¿El software o servicio contratado tiene garantía?",
    answer: "Sí. Cubrimos errores técnicos atribuibles al desarrollo mientras la solución se encuentre bajo nuestra administración y el uso sea el esperado."
  }
];
