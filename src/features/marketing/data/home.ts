import { site } from "@/features/marketing/data/site";
import type { BenefitItem, ClientLogo, MarketingPageData, ServiceItem } from "@/features/marketing/types";

export const homePage: MarketingPageData = {
  slug: "/",
  headerVariant: "pink",
  meta: {
    title: "AxolotlCode - Desarrollo de software y soluciones digitales",
    description:
      "AxolotlCode desarrolla software y soluciones digitales personalizadas para empresas que buscan crecer con tecnología."
  },
  hero: {
    kind: "home",
    title: "Desarrollo de soluciones tecnológicas a tu medida",
    body:
      "En AxolotlCode transformamos ideas en realidades digitales. Creamos aplicaciones innovadoras, seguras y personalizadas que impulsan tu negocio hacia el éxito. Con tecnologías de vanguardia y un enfoque en calidad, somos tu aliado estratégico en la transformación digital.",
    primaryCta: { label: "Conocer más", href: "/about" },
    secondaryCta: { label: "Contacto", href: "/contact#contact" }
  }
};

export const services: ServiceItem[] = [
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

export const clientLogos: ClientLogo[] = [
  { src: site.assets.logos.goser, href: "https://goser.mx/", alt: "Goser" },
  { src: site.assets.logos.disver, href: "https://disveruniformes.com.mx/", alt: "Disver Uniformes" },
  { src: site.assets.logos.client3, alt: "Cliente 3" },
  { src: site.assets.logos.client4, alt: "Cliente 4" },
  { src: site.assets.logos.aurumtage, href: "https://aurumtage.com/", alt: "Aurumtage" },
  { src: site.assets.logos.sittycia, href: "https://sittycia.com/", alt: "Sittycia" },
  { src: site.assets.logos.nutritionLab, href: "https://nutrition-lab.mx/", alt: "Nutrition Lab" },
  { src: site.assets.logos.larezza, href: "https://larezza.com/", alt: "Larezza" },
  { src: site.assets.logos.masterClean, href: "https://masterclean.mx/", alt: "Master Clean" },
  { src: site.assets.logos.valhui, href: "https://valhui.com/", alt: "Valhui" }
];

export const benefits: BenefitItem[] = [
  { title: "Innovación constante", body: "Utilizamos tecnologías de vanguardia." },
  { title: "Seguridad garantizada", body: "Protegemos tus datos y proyectos." },
  { title: "Resultados tangibles", body: "Diseñamos soluciones orientadas al éxito." }
];
