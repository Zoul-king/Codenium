import type { AboutCard, BenefitBullet, FaqItem, PlanItem, ServiceItem } from "@/features/site/types";

export const servicesData: ServiceItem[] = [
  {
    title: "Desarrollo de software",
    body: "Creación de aplicaciones y sistemas personalizados, escalables e innovadores para optimizar tu negocio.",
    icon: "code"
  },
  {
    title: "Consultorías",
    body: "Asesoría tecnológica estratégica para mejorar procesos, productividad y transformación digital empresarial.",
    icon: "consulting"
  },
  {
    title: "Profesionales a tu disposición",
    body: "Expertos en TI listos para potenciar proyectos con soluciones eficientes y personalizadas.",
    icon: "team"
  },
  {
    title: "Desarrollo a la medida",
    body: "Software a medida, adaptado a tus necesidades, con alta calidad y seguridad.",
    icon: "spark"
  },
  {
    title: "Soporte técnico",
    body: "Servicio técnico especializado en mantenimiento, resolución de problemas y optimización de sistemas informáticos.",
    icon: "support"
  },
  {
    title: "Incubadora",
    body: "Mentoría y apoyo para startups, acelerando su crecimiento con estrategias digitales innovadoras.",
    icon: "idea"
  }
];

export const logosData: string[] = [
  "Aurumtage",
  "Disver Uniformes",
  "Nutrition Lab",
  "Larezza",
  "Master Clean",
  "Chess IQ",
  "Aurum Living",
  "Mobility Guard"
];

export const benefitBulletsData: BenefitBullet[] = [
  ["Innovación constante", "Utilizamos tecnologías de vanguardia"],
  ["Seguridad garantizada", "Protegemos tus datos y proyectos"],
  ["Resultados tangibles", "Diseñamos soluciones orientadas al éxito"]
];

export const galleryData: string[] = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
];

export const aboutCardsData: AboutCard[] = [
  {
    title: "Nuestra historia",
    body: "AxolotlCode nació con la misión de transformar las ideas de nuestros clientes en soluciones tecnológicas de alto impacto."
  },
  {
    title: "Nuestro enfoque",
    body: "Desde nuestros inicios, hemos priorizado la innovación, la calidad y la seguridad en cada proyecto."
  }
];

export const missionVisionData: AboutCard[] = [
  {
    title: "Misión",
    body: "Desarrollamos tecnología con sello mexicano, creando soluciones innovadoras que transforman vidas y elevan el potencial de personas, empresas y comunidades."
  },
  {
    title: "Visión",
    body: "Ser una empresa tecnológica mexicana reconocida a nivel mundial por la calidad de sus soluciones, su capacidad de innovar y un ambiente laboral que promueve el crecimiento individual del equipo."
  }
];

export const timelineData: string[] = [
  "Investigación y recopilación de información",
  "Planificación (mapa del sitio, wireframes, etc.)",
  "Diseño visual y prototipos",
  "Creación de contenido",
  "Desarrollo frontend y backend",
  "Pruebas, calidad y despliegue",
  "Mantenimiento y actualizaciones"
];

export const faqsData: FaqItem[] = [
  [
    "¿Qué tipo de software pueden desarrollar para mi empresa?",
    "Desarrollamos soluciones de software personalizadas, incluyendo aplicaciones web, móviles y sistemas empresariales. Nuestro enfoque se basa en comprender tus necesidades y crear herramientas innovadoras que optimicen tus procesos, mejoren la eficiencia y aumenten la productividad de tu empresa."
  ],
  [
    "¿Cómo puedo contratar una consultoría tecnológica con ustedes?",
    "Es muy fácil. Solo contáctanos a través de nuestro sitio web o por teléfono, y programaremos una reunión para entender tus objetivos y desafíos. Nuestro equipo de expertos te brindará asesoría estratégica basada en las mejores prácticas del sector para ayudarte a tomar decisiones tecnológicas acertadas."
  ],
  [
    "¿Qué beneficios tiene contar con profesionales a disposición?",
    "Contar con nuestros profesionales en TI te permite disponer de expertos altamente capacitados en diversas áreas de tecnología sin la necesidad de contratar personal adicional. Esto reduce costos operativos, agiliza procesos y garantiza soluciones eficientes adaptadas a las necesidades de tu negocio."
  ],
  [
    "¿Cuál es la diferencia entre software estándar y software a medida?",
    "El software estándar es genérico y diseñado para un público amplio, lo que puede generar limitaciones en su funcionalidad. En cambio, el software a medida se desarrolla específicamente para tu empresa, permitiéndote automatizar procesos, optimizar recursos y garantizar una mayor eficiencia sin restricciones."
  ],
  [
    "¿Cuánto tiempo tarda el desarrollo de un software?",
    "El tiempo de desarrollo depende de la complejidad del proyecto y sus funcionalidades. Antes de iniciar, realizamos un análisis detallado para estimar plazos realistas y garantizar las entregas dentro del tiempo acordado. Nos aseguramos de ofrecer calidad sin comprometer la rapidez."
  ],
  [
    "¿Ofrecen mantenimiento y actualizaciones para los sistemas desarrollados?",
    "Ofrecemos soporte continuo para garantizar el óptimo funcionamiento de su software. Nuestras actualizaciones incluyen mejoras de seguridad, compatibilidad con nuevas tecnologías y optimización de rendimiento, asegurando que su sistema esté siempre actualizado y protegido."
  ],
  [
    "¿Puedo escalar mi software a futuro si mi empresa crece?",
    "Diseñamos soluciones escalables que pueden evolucionar junto con tu empresa. Ya sea agregando nuevas funcionalidades, optimizando rendimiento o integrando herramientas adicionales, nuestro software se adapta al crecimiento de tu negocio sin necesidad de reemplazarlo."
  ],
  [
    "¿El software o servicio contratado tiene garantía?",
    "Ofrecemos garantía en todos nuestros desarrollos y servicios. Mientras el software o sistema se encuentre bajo nuestra administración, corregiremos de forma GRATUITA cualquier error técnico que pueda surgir, siempre que no sea causado por un mal uso por parte del cliente."
  ]
];

export const plansData: PlanItem[] = [
  {
    title: "Plan básico",
    price: "Pago inicial de $2,000 MXN",
    subtitle: "Mensualidad de $500 MXN",
    items: [
      "Desarrollo de landing page (one-page)",
      "Hosting",
      "SEO básico onsite",
      "Cambios básicos ilimitados (información, imágenes, etc.)"
    ]
  },
  {
    title: "Plan Pymes",
    price: "Pago inicial de $5,000 MXN",
    subtitle: "Mensualidad de $1,500 MXN",
    note: "Todo lo del Plan Básico, más...",
    items: [
      "Página de dos a tres vistas internas",
      "SEO avanzado onsite",
      "Control de clientes",
      "Cambios avanzados (dos máximos al mes, cambio de funcionamiento o agregar secciones)"
    ]
  },
  {
    title: "Plan E-commerce",
    price: "Pago inicial de $10,000 MXN",
    subtitle: "Mensualidad de $2,500 MXN",
    note: "Todo lo del Plan Pymes, más...",
    items: ["Página web + tienda", "Control de clientes", "Administración de productos", "Integración de pasarelas de pago"]
  }
];
