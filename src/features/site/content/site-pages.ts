import type { SharedSite, SitePagesMap } from "@/features/site/types";

export const sharedSite: SharedSite = {
  brand: {
    name: "AxolotlCode",
    short: "AX"
  },
  menu: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y Servicios", href: "/plans" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" }
  ],
  footerMenu: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/about" },
    { label: "Planes y Servicios", href: "/plans" },
    { label: "Portafolio", href: "/portfolio" },
    { label: "Contacto", href: "/contact" },
    { label: "Aviso de privacidad", href: "/legals/privacy" }
  ],
  overlay: {
    location: "Estado de México",
    city: "Nezahualcóyotl",
    email: "admin@axolotlcode.tech",
    phone: "+(52) 56 2495 5086",
    phoneRaw: "+525624955086"
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/axolotl.code/", icon: "instagram" },
    { label: "X Twitter", href: "https://x.com/AxolotlCode", icon: "x" },
    { label: "Facebook", href: "https://www.facebook.com/Desarrollo.software.axolotlcode", icon: "facebook" },
    { label: "LinkedIn", href: "https://mx.linkedin.com/in/axolotl-code-86b85732a?trk=public_post_feed-actor-name", icon: "linkedin" },
    { label: "TikTok", href: "https://www.tiktok.com/@axolotl.code", icon: "tiktok" }
  ],
  sticky: {
    message: "¡Contáctanos!",
    label: "Por WhatsApp",
    href: "https://wa.link/ivbalm"
  },
  footer: {
    body:
      "En AxolotlCode transformamos ideas en realidades digitales. Creamos aplicaciones innovadoras, seguras y personalizadas que impulsan tu negocio hacia el éxito.",
    legal: "© 2026 AxolotlCode. Todos los derechos reservados."
  }
};

export const sitePages: SitePagesMap = {
  home: {
    key: "home",
    title: "AxolotlCode - Desarrollo de software y soluciones digitales",
    description:
      "AxolotlCode: desarrollo de software y soluciones digitales personalizadas. Creamos aplicaciones innovadoras que transforman tu negocio.",
    headerVariant: "pink",
    hero: {
      kind: "home",
      title: "Desarrollo de soluciones tecnológicas a tu medida",
      body:
        "En AxolotlCode transformamos ideas en realidades digitales. Creamos aplicaciones innovadoras, seguras y personalizadas que impulsan tu negocio hacia el éxito. Con tecnologías de vanguardia y un enfoque en calidad, somos tu aliado estratégico en la transformación digital.",
      primaryCta: { label: "Conocer más", href: "/about" },
      secondaryCta: { label: "Contacto", href: "/contact" }
    },
    sections: ["services", "logos", "benefits", "contactStrip"]
  },
  about: {
    key: "about",
    title: "Sobre nosotros - AxolotlCode",
    description:
      "Conoce la historia, misión, visión y proceso de trabajo de AxolotlCode para crear soluciones digitales innovadoras.",
    headerVariant: "white",
    hero: {
      kind: "image",
      title: "Sobre",
      accent: "nosotros",
      body:
        "En AxolotlCode, nuestra pasión por la innovación y el desarrollo digital nos impulsa a construir soluciones que transforman ideas en realidades tecnológicas. Con un equipo comprometido y una visión centrada en el futuro, trabajamos para crear productos que generen impacto y valor duradero.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
    },
    sections: ["aboutStory", "missionVision", "timeline", "ctaDual"]
  },
  plans: {
    key: "plans",
    title: "Planes y servicios - AxolotlCode",
    description:
      "Descubre nuestros planes y servicios personalizados para impulsar tu presencia digital y el crecimiento de tu negocio.",
    headerVariant: "white",
    hero: {
      kind: "image",
      title: "Planes y",
      accent: "servicios",
      body:
        "Descubre nuestras soluciones diseñadas para adaptarse a tus necesidades. Ofrecemos servicios personalizados para llevar tus proyectos al siguiente nivel, con planes flexibles y opciones que se ajustan a cada etapa de tu crecimiento.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
    },
    sections: ["planServices", "pricingPlans", "ctaSingle"]
  },
  portfolio: {
    key: "portfolio",
    title: "Portfolio",
    description:
      "Aquí encontrarás una selección de proyectos en los que AxolotlCode ha trabajado, desde desarrollos web hasta aplicaciones móviles.",
    headerVariant: "pink",
    hero: {
      kind: "portfolio",
      title: "Proyectos",
      body:
        "Aquí encontrarás una selección de proyectos en los que AxolotlCode ha trabajado, desde desarrollos web hasta aplicaciones móviles. Cada proyecto refleja nuestra dedicación y pasión por crear soluciones digitales innovadoras.",
      cards: [
        {
          name: "Mobility Guard",
          year: "2025",
          description:
            "Plataforma inteligente para monitorear vehículos y peatones en tiempo real, generando reportes detallados y visualizaciones para la toma de decisiones en movilidad y seguridad.",
          tags: ["Monitoreo", "Vehículos", "Peatones", "Reportes", "Análisis de Datos"],
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Aurum Living",
          year: "2025",
          description:
            "Empresa dedicada a la renta de espacios e inmuebles privados. Desarrollamos su sitio web, gestionamos campañas de marketing digital e instalamos la infraestructura de red para potenciar su operación y visibilidad.",
          tags: ["Renta de Espacios", "Inmuebles", "Sitio Web", "Marketing", "Infraestructura de Red"],
          image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Chess IQ",
          year: "2025",
          description:
            "Plataforma para el seguimiento y gestión de cobranza de pagos de clientes de un banco, optimizando la recuperación de cartera mediante tecnología y análisis de datos.",
          tags: ["Cobranza Bancaria", "Seguimiento de Pagos", "Gestión de Cartera", "Análisis de Datos", "Optimización"],
          image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Nutrition Lab",
          year: "2025",
          description:
            "Landing page informativa sobre la empresa, acompañada de una plataforma de videos sobre nutrición, entrenamiento personal y uso de herramientas para ejercitarse.",
          tags: ["Nutrición", "Entrenamiento", "Videos", "Educación", "Salud"],
          image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Larezza",
          year: "2025",
          description:
            "Empresa especializada en masajes faciales. Desarrollamos una landing page atractiva y gestionamos campañas de marketing digital para potenciar su presencia y captar nuevos clientes.",
          tags: ["Masajes Faciales", "Landing Page", "Marketing", "Bienestar", "Salud"],
          image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Master Clean",
          year: "2025",
          description:
            "Empresa dedicada a ofrecer servicios de limpieza profesional para empresas privadas. Trabajamos con ellos en el desarrollo de una landing page moderna y campañas de marketing digital para potenciar su presencia y captar nuevos clientes.",
          tags: ["Limpieza Empresarial", "Landing Page", "Marketing Digital", "Servicios", "Empresas Privadas"],
          image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
        },
        {
          name: "Disver Uniformes",
          year: "2025",
          description:
            "Tienda en línea especializada en la venta de uniformes para empresas, escuelas y negocios. Desarrollamos su ecommerce, facilitando la compra y personalización de uniformes desde cualquier lugar.",
          tags: ["Ecommerce", "Uniformes", "Tienda en Línea", "Personalización", "Venta Online"],
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80"
        }
      ]
    },
    sections: ["portfolioCards"]
  },
  contact: {
    key: "contact",
    title: "Contacto - AxolotlCode",
    description:
      "¿Tienes dudas o necesitas más información sobre nuestros servicios? Contáctanos o consulta nuestra sección de preguntas frecuentes.",
    headerVariant: "white",
    hero: {
      kind: "image",
      title: "Contacto y",
      accent: "Preguntas Frecuentes",
      body:
        "¿Tienes dudas o necesitas más información sobre nuestros servicios? Contáctanos o consulta nuestra sección de preguntas frecuentes. Estamos comprometidos en brindarte respuestas claras y rápidas para que tengas la mejor experiencia con nosotros.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
    },
    sections: ["faq", "contactForm"]
  },
  privacy: {
    key: "privacy",
    title: "Aviso de privacidad - AxolotlCode",
    description: "Página auxiliar para el aviso de privacidad.",
    headerVariant: "pink",
    hero: {
      kind: "portfolio",
      title: "Aviso de privacidad",
      body: "Espacio listo para sustituir por tu aviso de privacidad final sin romper la plantilla."
    },
    sections: []
  }
};
