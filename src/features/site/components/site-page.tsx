"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type InputHTMLAttributes } from "react";
import { ArrowRightIcon, BrandLogo, CheckIcon, ContactIcon, MenuIcon, ServiceIcon, SocialIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ReferenceFooter } from "@/features/site/components/reference-footer";
import { ReferenceHeader } from "@/features/site/components/reference-header";
import { referenceAssets } from "@/features/site/content/reference-assets";
import {
  aboutCardsData,
  benefitBulletsData,
  faqsData,
  galleryData,
  logosData,
  missionVisionData,
  plansData,
  servicesData,
  timelineData
} from "@/features/site/content/site-content";
import { useReveal } from "@/hooks/use-reveal";
import { sharedSite } from "@/features/site/content/site-pages";
import type { ContactIconType, PortfolioCard, SitePageDefinition } from "@/features/site/types";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.1536937650258!2d-99.01649832596578!3d19.405764241539625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fd95427949d1%3A0xa5e068376bf62c07!2sCentro%20operativo%20Axolotlcode%2FDesarrollo%20de%20software!5e0!3m2!1ses!2smx!4v1754600848731!5m2!1ses!2smx";

const services = [
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
    body: "MentorÃ­a y apoyo para startups, acelerando su crecimiento con estrategias digitales innovadoras.",
    icon: "idea"
  }
];

const logos = ["Aurumtage", "Disver Uniformes", "Nutrition Lab", "Larezza", "Master Clean", "Chess IQ", "Aurum Living", "Mobility Guard"];

const benefitBullets = [
  ["Innovación constante", "Utilizamos tecnologías de vanguardia"],
  ["Seguridad garantizada", "Protegemos tus datos y proyectos"],
  ["Resultados tangibles", "Diseñamos soluciones orientadas al éxito"]
];

const gallery = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
];

const aboutCards = [
  {
    title: "Nuestra historia",
    body:
      "AxolotlCode nació con la misión de transformar las ideas de nuestros clientes en soluciones tecnológicas de alto impacto."
  },
  {
    title: "Nuestro enfoque",
    body:
      "Desde nuestros inicios, hemos priorizado la innovación, la calidad y la seguridad en cada proyecto."
  }
];

const missionVision = [
  {
    title: "Misión",
    body:
      "Desarrollamos tecnologÃ­a con sello mexicano, creando soluciones innovadoras que transforman vidas y elevan el potencial de personas, empresas y comunidades."
  },
  {
    title: "Visión",
    body:
      "Ser una empresa tecnológica mexicana reconocida a nivel mundial por la calidad de sus soluciones, su capacidad de innovar y un ambiente laboral que promueve el crecimiento individual del equipo."
  }
];

const timeline = [
  "Investigación y recopilación de información",
  "Planificación (mapa del sitio, wireframes, etc.)",
  "Diseño visual y prototipos",
  "Creación de contenido",
  "Desarrollo frontend y backend",
  "Pruebas, calidad y despliegue",
  "Mantenimiento y actualizaciones"
];

const faqs = [
  [
    "¿Qué tipo de software pueden desarrollar para mi empresa?",
    "Desarrollamos soluciones de software personalizadas, incluyendo aplicaciones web, móviles y sistemas empresariales. Nuestro enfoque se basa en comprender tus necesidades y crear herramientas innovadoras que optimicen tus procesos, mejoren la eficiencia y aumenten la productividad de tu empresa."
  ],
  [
    "¿Cómo puedo contratar una consultoría tecnológica con ustedes?",
    "Es muy fácil. Solo contáctanos a través de nuestro sitio web o por teléfono, y programaremos una reunión para entender tus objetivos y desafÃ­os. Nuestro equipo de expertos te brindará asesorÃ­a estratégica basada en las mejores prácticas del sector para ayudarte a tomar decisiones tecnológicas acertadas."
  ],
  [
    "¿Qué beneficios tiene contar con profesionales a disposición?",
    "Contar con nuestros profesionales en TI te permite disponer de expertos altamente capacitados en diversas áreas de tecnologÃ­a sin la necesidad de contratar personal adicional. Esto reduce costos operativos, agiliza procesos y garantiza soluciones eficientes adaptadas a las necesidades de tu negocio."
  ],
  [
    "¿Cuál es la diferencia entre software estándar y software a medida?",
    "El software estándar es genérico y diseñado para un público amplio, lo que puede generar limitaciones en su funcionalidad. En cambio, el software a medida se desarrolla especÃ­ficamente para tu empresa, permitiéndote automatizar procesos, optimizar recursos y garantizar una mayor eficiencia sin restricciones."
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

const plans = [
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
      "SEO Avanzado onsite",
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

interface SitePageProps {
  page: SitePageDefinition;
}

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

interface CtaCardProps {
  dual?: boolean;
}

interface FormFieldProps {
  label: string;
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

interface ContactInfoProps {
  label: string;
  value: string;
  icon: ContactIconType;
}

export function SitePage({ page }: SitePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  return (
    <div className="bg-white text-body-color">
      <ReferenceHeader page={page} open={menuOpen} setOpen={setMenuOpen} />
      <main className="relative min-h-screen overflow-hidden">
        <Hero page={page} />
        {page.sections.includes("services") && <ServicesSection />}
        {page.sections.includes("logos") && <LogosSection />}
        {page.sections.includes("benefits") && <BenefitsSection />}
        {page.sections.includes("contactStrip") && <ContactStrip />}
        {page.sections.includes("aboutStory") && <AboutStory />}
        {page.sections.includes("missionVision") && <MissionVisionSection />}
        {page.sections.includes("timeline") && <TimelineSectionFixed />}
        {page.sections.includes("ctaDual") && <CtaCard dual />}
        {page.sections.includes("planServices") && <PlanServices />}
        {page.sections.includes("pricingPlans") && <PricingPlans />}
        {page.sections.includes("ctaSingle") && <CtaCard />}
        {page.sections.includes("portfolioCards") && page.hero.kind === "portfolio" && page.hero.cards ? (
          <PortfolioShowcase cards={page.hero.cards} />
        ) : null}
        {page.sections.includes("faq") && <FaqSection />}
        {page.sections.includes("contactForm") && <ContactPageSection />}
      </main>
      <ReferenceFooter />
      <StickyWhatsApp />
    </div>
  );
}

function Header({ page, open, setOpen }: { page: SitePageDefinition; open: boolean; setOpen: (value: boolean | ((current: boolean) => boolean)) => void }) {
  const whiteHeader = page.headerVariant === "white";

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 h-28">
        <div className="site-shell flex items-center justify-between px-3 py-2 text-white">
          <Link href="/" aria-label="Inicio" className="flex items-center gap-3">
            <div className={`logo-mark ${whiteHeader ? "white-mark" : ""}`}>{sharedSite.brand.short}</div>
            <span className="text-xl font-normal text-white">{sharedSite.brand.name}</span>
          </Link>
          <button
            type="button"
            className="group flex items-center gap-2 font-normal leading-7 text-white transition-colors hover:text-primary-500"
            aria-expanded={open}
            aria-label="Abrir menú"
            onClick={() => setOpen((current) => !current)}
          >
            <MenuIcon />
            Menú
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#EFEFEF] transition-opacity duration-700 ease-in-out ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 h-full transition-transform duration-700 ease-in-out ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}`}
      >
        <div className="absolute inset-0 bg-white">
          <header className="absolute inset-x-0 top-0 z-10 h-28 text-body-color">
            <div className="site-shell flex items-center justify-between px-3 py-2">
              <Link href="/" aria-label="Inicio" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <div className="logo-mark white-mark">{sharedSite.brand.short}</div>
                <span className="text-xl font-normal text-body-color">{sharedSite.brand.name}</span>
              </Link>
              <button
                type="button"
                className="group flex items-center gap-2 font-normal leading-7 text-body-color transition-colors hover:text-primary-500"
                aria-expanded={open}
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <MenuIcon />
                Menú
              </button>
            </div>
          </header>

          <div
            className={`site-shell mt-[90px] flex h-[calc(90vh-50px)] flex-col items-center justify-start overflow-y-scroll px-4 pb-8 transition-all duration-700 ease-in-out md:mt-[115px] md:overflow-y-hidden xl:h-[calc(80vh)] ${open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
          >
            <div className="flex h-[calc(100dvh-20px)] w-full flex-col items-center justify-start divide-y divide-body-color pb-8 sm:h-[calc(80dvh-50px)] sm:flex-row sm:divide-x sm:divide-y-0 md:justify-between">
              <div className="w-full">
                <nav className="mx-auto w-full p-4 md:max-w-[400px]">
                  <ol className="flex flex-col justify-center gap-y-5 lg:gap-y-12">
                    {sharedSite.menu.map((item, index) => (
                      <li key={item.href} className="flex items-end gap-x-2">
                    <span className="inline-block text-base text-primary-500 md:text-xl lg:text-2xl xl:text-3xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Link
                          href={item.href}
                          className="text-2xl transition-colors hover:text-primary-500 md:text-3xl lg:text-4xl"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="w-full">
                <div className="mx-auto w-full p-4 md:max-w-[400px]">
                  <div className="mb-8 flex flex-col gap-y-[5px] lg:mb-[68px]">
                    <span className="text-2xl font-normal lg:text-[32px] lg:leading-9">{sharedSite.overlay.location}</span>
                    <span className="text-lg font-light lg:text-xl">{sharedSite.overlay.city}</span>
                  </div>
                  <div className="mb-4 flex flex-col gap-y-[5px] lg:mb-[26px]">
                    <span className="text-2xl text-primary-500 lg:text-[32px] lg:leading-9">Contacto</span>
                    <ul className="mb-[15px] text-lg font-light lg:text-xl lg:leading-9">
                      <li>
                        <a href={`mailto:${sharedSite.overlay.email}`} className="hover:underline">
                          {sharedSite.overlay.email}
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${sharedSite.overlay.phoneRaw}`} className="hover:underline">
                          {sharedSite.overlay.phone}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <span className="mb-2 text-2xl leading-9 text-primary-500 lg:text-[32px]">Redes sociales</span>
                    <ul className="flex gap-x-[15px] text-sm">
                      {sharedSite.socials.map((social) => (
                        <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-100/50">
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            className="grid size-[50px] place-content-center rounded-[5px] border border-primary-100 text-primary-500"
                          >
                            <SocialIcon type={social.icon} className="size-5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Hero({ page }: { page: SitePageDefinition }) {
  if (page.hero.kind === "home") {
    return (
        <section className="section soft-section relative flex min-h-dvh items-center justify-center overflow-hidden pt-[114px]">
          <div className="site-shell background__waves relative flex flex-col items-center gap-6 pt-12 pb-[155px] md:flex-row lg:gap-[50px] lg:pt-[76px] lg:pb-[190px]">
            <article className="hero-text hero__content flex w-full flex-col items-center gap-6 text-center md:items-start md:gap-10 md:text-left" data-animate="fadeInFromLeft">
              <h1 className="type-hero-home">{page.hero.title}</h1>
              <p className="text-base leading-7 xl:text-xl xl:leading-9"><span className="font-bold text-primary-500">AxolotlCode</span> {page.hero.body.replace(/^En AxolotlCode\s*/,"")}</p>
              <div className="flex flex-row gap-4">
              <Link className="primary-button" href={page.hero.primaryCta.href}>
                {page.hero.primaryCta.label}
              </Link>
              <Link className="secondary-button" href={page.hero.secondaryCta.href}>
                {page.hero.secondaryCta.label}
              </Link>
            </div>
          </article>
          <div className="hero-image hidden w-full max-w-[432px] max-h-[432px] md:block" data-animate="fadeInFromRight">
            <HeroArtwork />
          </div>
          <OrbBackground />
        </div>
        <HeroGradients />
      </section>
    );
  }

  if (page.hero.kind === "portfolio") {
    return (
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0">
          <PortfolioGradients />
        </div>
          <div className="site-shell">
          <h1 className="type-hero-portfolio" data-animate="fadeIn">
                  {page.hero.title}
                </h1>
          <p className="mx-auto mb-16 max-w-4xl text-center type-body lg:mb-24" data-animate="fadeIn" data-delay="0.1">
              {page.hero.body}
            </p>
          </div>
      </section>
    );
  }

  return (
    <section className="relative h-full w-full text-white">
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${page.hero.image})` }}
      />
      <div className="absolute inset-0 h-full w-full bg-black/75" />
        <div className="hero relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-[186px] text-center md:py-[135px] xl:py-[276px]" data-animate="fadeIn">
          <h1 className="type-hero-inner mb-8">
            {page.hero.title}
            {page.hero.accent ? <span className="text-primary-200"> {page.hero.accent}</span> : null}
          </h1>
          <p className="max-w-[900px] type-hero-copy font-normal text-white md:font-light">{page.hero.body}</p>
        </div>
      </section>
    );
}

function ServicesSection() {
  return (
    <section className="section soft-section">
      <div className="site-shell py-20">
        <div className="mb-20 text-center offer-info" data-animate="fadeInFromTop">
          <span className="type-kicker">Novedades</span>
          <h2 className="type-section-title">¿Qué ofrecemos?</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
              <article key={service.title} className="service-card" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <ServiceIcon type={service.icon} />
              <h3 className="type-card-title">{service.title}</h3>
              <p className="text-center text-sm leading-6 text-gray-600 lg:text-base">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogosSection() {
  const repeated = [...logosData, ...logosData];

  return (
    <section className="section relative bg-foreground">
        <div className="site-shell flex min-h-[70vh] flex-col items-center justify-between gap-x-7 gap-y-12 py-16 md:flex-row">
        <article className="flex w-full flex-col gap-4" data-animate="fadeInFromTop">
          <span className="type-kicker">Clientes satisfechos</span>
          <h2 className="type-section-title">
            Marcas que <span className="text-secondary-500">confiaron</span> en nuestro trabajo
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nos enorgullece haber desarrollado sitios web para empresas que valoran la calidad. Estos son algunos de los clientes que confiaron en nosotros y quedaron satisfechos con los resultados.
          </p>
        </article>
        <article className="slider" data-animate="fadeInFromBottom">
          <div className="track">
            {repeated.map((item, index) => (
              <div key={`${item.alt}-${index}`} className="item cursor-pointer">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="block h-full w-full">
                    <img src={item.src} alt={item.alt} className="logo-slide-image" />
                  </a>
                ) : (
                  <span className="block h-full w-full">
                    <img src={item.src} alt={item.alt} className="logo-slide-image" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="soft-section relative w-full">
        <div className="section site-shell relative z-20 flex min-h-[70vh] flex-col items-center gap-x-5 gap-y-[50px] py-16 sm:flex-row lg:gap-[50px]">
        <div className="grid w-full grid-cols-1 gap-5 min-[900px]:grid-cols-2">
          {galleryData.map((image, index) => (
            <div
              key={image}
              className={`relative h-full min-h-[199px] w-full overflow-hidden rounded-[10px] transition-transform hover:scale-[1.02] ${index === 1 ? "block" : "hidden min-[900px]:block"}`}
              data-animate="fadeIn"
                data-delay={String(index * 0.12)}
              >
              <Image src={image} alt="Preview" fill className="object-cover" sizes="(min-width: 900px) 285px, 100vw" />
            </div>
          ))}
        </div>
        <article className="flex w-full flex-col items-start text-left" data-animate="fadeIn">
          <div className="mb-3 flex flex-col gap-4">
            <span className="type-kicker">¿Por qué AxolotlCode?</span>
            <h2 className="type-section-title">
              En AxolotlCode construimos <span className="text-secondary-500">más que software</span>
            </h2>
            <p className="max-w-2xl text-sm text-body-color sm:text-base">
              Creamos soluciones que impulsan tu negocio hacia el éxito. Nuestro equipo combina innovación, calidad y compromiso para desarrollar herramientas tecnológicas personalizadas.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-1">
            {benefitBulletsData.map(([lead, text]) => (
              <div key={lead} className="flex items-center gap-4 rounded-lg p-2 transition-colors duration-300 hover:bg-primary-500/10 md:p-1">
                <div className="p-2 text-secondary-500">
                  <CheckIcon />
                </div>
                <span className="text-[16px] font-bold text-gray-700 xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base">
                  {lead}: <span className="font-normal">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
      <svg width="407" height="598" viewBox="0 0 407 598" fill="none" className="absolute top-0 z-10 w-full">
        <g filter="url(#benefit-glow)">
          <circle cx="52.651" cy="293.651" r="153.475" transform="rotate(-30 52.651 293.651)" fill="#B1E7E8" />
        </g>
        <defs>
          <filter id="benefit-glow" x="-300.85" y="-59.8498" width="707.002" height="707.002" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_4040_2295" />
          </filter>
        </defs>
      </svg>
    </section>
  );
}

function ContactStrip() {
  return (
    <section className="section overflow-hidden bg-foreground">
      <div className="site-shell flex flex-col gap-5 py-16 lg:flex-row lg:gap-[50px]">
        <article className="contact flex w-full flex-col items-center gap-5 text-center lg:max-w-[540px] lg:items-start lg:gap-6 lg:text-left" data-animate="fadeInFromLeft">
          <span className="type-kicker">Contáctanos</span>
          <h2 className="type-section-title">
            ¿Tienes algún <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            ¡Nosotros podemos ayudarte! Abarcamos gran parte de la Ciudad de México y alrededores.
          </p>
          <Link href="/contact" className="contact-button">
            Enviar mensaje
          </Link>
        </article>
        <article className="map w-full" data-animate="fadeInFromRight" data-delay="0.12">
          <div className="h-[300px] overflow-hidden rounded-xl sm:h-[400px]">
            <iframe
              title="Ubicación"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-2">
            <div className="w-full flex items-start gap-4">
              <ContactInfo label="Correo electrónico" value={sharedSite.overlay.email} icon="mail" />
            </div>
            <div className="w-full flex items-start gap-4">
              <ContactInfo label="Teléfono" value={sharedSite.overlay.phone} icon="phone" />
            </div>
            <div className="w-full flex items-start gap-4">
              <ContactInfo label="Ubicación" value={`${sharedSite.overlay.location}, ${sharedSite.overlay.city}`} icon="location" />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function AboutStory() {
  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell flex flex-col gap-10 py-10 md:flex-row md:items-center md:gap-[50px] xl:py-[71px]">
        <article className="about-info w-full flex flex-col gap-4 text-center text-sm leading-6 md:text-left lg:text-base lg:leading-7" data-animate="fadeInFromLeft">
          <span className="type-kicker">Sobre nosotros</span>
          <h2 className="type-section-title">
            Conoce nuestra <span className="text-secondary-500">historia</span>
          </h2>
          <p className="mb-2">
            AxolotlCode nació con la misión de transformar las ideas de nuestros clientes en soluciones tecnológicas de alto impacto. Desde nuestros inicios, hemos priorizado la innovación, la calidad y la seguridad en cada proyecto, trabajando con un equipo comprometido y apasionado.
          </p>
          <p>
            A lo largo de nuestra trayectoria, hemos ayudado a empresas de diversos sectores a modernizar sus procesos y alcanzar sus objetivos en un mundo digital en constante evolución. Nos enorgullece ser aliados estratégicos en la transformación tecnológica de nuestros clientes.
          </p>
        </article>
        <div className="about-image hidden w-full md:block" data-animate="fadeInFromRight">
          <Image src={referenceAssets.about.story} alt="Sobre nosotros - Conoce nuestra historia" width={548} height={548} className="h-auto w-full" sizes="548px" />
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="soft-section bg-foreground">
      <div className="section site-shell flex flex-col items-center gap-y-2.5 gap-x-[40px] py-10 sm:flex-row xl:py-[66px] 2xl:py-[80px]">
        <div className="company-image grid w-full place-content-center" data-animate="fadeInFromLeft">
          <Image src={referenceAssets.about.company} alt="Sobre nosotros - Compañía" width={516} height={516} />
        </div>
        <div className="company-cards flex w-full flex-col gap-[50px]">
          <div className="mb-8 text-center" data-animate="fadeInFromTop">
            <span className="type-kicker">Nuestros pilares</span>
            <h2 className="type-section-title mt-4">
              Conoce nuestra <span className="text-secondary-500">misión y visión</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {missionVisionData.map((item, index) => (
              <article
                key={item.title}
                className="flex flex-col gap-4 px-6 py-4 text-center text-body-color shadow-[0_4px_10px_0_rgba(148,148,148,0.13)] backdrop-blur-[20px] md:text-left"
                data-animate="fadeInFromRight"
                data-delay={String(index * 0.12)}
              >
                <h3 className="text-2xl font-bold leading-7 xl:text-[32px] xl:leading-10">{item.title}</h3>
                <span className="text-sm leading-6 xl:text-base xl:leading-7">{item.body}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="soft-section relative overflow-hidden bg-foreground">
        <div className="timeline section site-shell relative z-20 py-14 text-center">
        <span className="text-base leading-5 text-primary-500 lg:text-[24px]" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="mt-4 text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]" data-animate="fadeIn">
          ¿Cómo lo <span className="text-secondary-500">hacemos</span>?
        </h2>
        <div className="relative mx-auto mt-10 flex max-w-[596px] flex-col gap-4">
          <div className="absolute top-[78px] flex h-full w-full justify-center">
            <svg className="block h-[1630px] w-[356px]" viewBox="0 0 274 2238" fill="none">
              <path d="M46.5838 1H273V385.981H1V745.054H273V1141.234H1V1464.04H273V1847.34H1V2178" stroke="#212529" strokeDasharray="16 16" />
            </svg>
          </div>
          <div className="flex w-full flex-col gap-4">
            {timelineData.map((step, index) => (
              <article
                key={step}
                className={`flex max-w-[275px] flex-col items-center gap-4 text-center sm:max-w-[356px] lg:p-2 ${index % 2 === 0 ? "self-start" : "self-end"}`}
                data-animate="fadeInFromBottom"
              >
                <div className="relative h-[108px] w-[108px] rounded-full border border-primary-400 bg-white p-1.5">
                  <div className="h-[94px] w-[94px] rounded-full bg-gradient-to-br from-primary-100 to-secondary-500/40" />
                  <span className="absolute right-1 bottom-1 inline-grid size-[42px] place-content-center rounded-full bg-primary-500 text-[20px] font-normal text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[18px] font-normal leading-8">{step}</span>
                <p className="text-sm leading-[26px] lg:text-base lg:leading-7">
                  Este paso nos permite dar estructura, claridad y una base real para una ejecución ordenada.
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSectionFixed() {
  const stepDescriptions = [
    "Descubrimos juntos lo que requiere tu proyecto y cómo podemos lograr una solución clara desde el inicio.",
    "Estructuramos tus ideas para darle vida a tu proyecto con una base funcional y ordenada.",
    "Convertimos la estructura en una propuesta visual consistente con tu marca y tus objetivos.",
    "Definimos textos, mensajes y recursos que ayudan a comunicar mejor el valor del producto.",
    "Construimos la solución con foco en rendimiento, escalabilidad y experiencia de usuario.",
    "Validamos cada detalle antes del lanzamiento para asegurar estabilidad y calidad.",
    "Damos seguimiento para mantener la solución actualizada y lista para crecer."
  ];

  return (
    <section className="soft-section relative overflow-hidden bg-foreground">
      <div className="timeline section site-shell relative z-20 py-14 text-center lg:py-20">
        <span className="type-kicker" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="type-section-title mt-4" data-animate="fadeIn">
          ¿Cómo lo <span className="text-secondary-500">hacemos</span>?
        </h2>
        <div className="relative mx-auto mt-8 max-w-[820px]">
          <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 border-l border-dashed border-black/40 lg:block" />
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2">
            {timelineData.map((step, index) => (
              <article
                key={step}
                className={`relative flex flex-col items-center gap-4 text-center lg:max-w-[300px] ${index % 2 === 0 ? "lg:justify-self-start lg:pr-8" : "lg:justify-self-end lg:pl-8"} ${index % 2 === 0 ? "lg:mt-0" : "lg:mt-10"}`}
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="relative h-[150px] w-[150px] rounded-full border border-primary-400 bg-white p-1.5">
                  <Image
                    src={referenceAssets.timeline[index]}
                    alt={`Paso ${index + 1}`}
                    width={136}
                    height={136}
                    className="h-[136px] w-[136px] rounded-full"
                  />
                  <span className="absolute right-0 bottom-0 inline-grid size-[52px] place-content-center rounded-full bg-primary-500 text-[28px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[280px] text-base font-bold leading-5 lg:text-[1.75rem] lg:leading-7">{step}</span>
                <p className="max-w-[280px] text-sm leading-[26px] text-body-color lg:text-base lg:leading-7">{stepDescriptions[index]}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanServices() {
  return (
    <section className="soft-section bg-foreground">
        <div className="services section site-shell py-20 text-center">
        <div className="info" data-animate="fadeInFromTop">
          <span className="type-kicker">Nuestros servicios</span>
          <h2 className="type-section-title mt-4 mb-8">
            ¿Cómo podemos <span className="text-secondary-500">ayudarte</span>?
          </h2>
        </div>
        <div className="items grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
              <article key={service.title} className="relative w-full rounded-lg bg-white p-8 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <div className="relative z-10 flex items-start gap-6">
                <ServiceIcon type={service.icon} />
                <div>
                  <h3 className="text-xl font-bold leading-6 xl:text-2xl xl:leading-7">{service.title}</h3>
                  <p className="mt-6 text-sm leading-[26px] xl:text-base xl:leading-7">{service.body}</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_45%_90%,rgba(86,202,204,0.35),transparent_35%)]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPlans() {
  return (
    <section className="soft-section relative">
      <div className="section site-shell relative z-20 py-20 text-black">
        <div className="plan-info mb-12 text-center lg:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker">Nuestros planes</span>
          <h2 className="type-section-title mt-4">
            ¿Qué <span className="text-secondary-500">ofrecemos</span>?
          </h2>
        </div>
        <div className="items grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {plansData.map((plan, index) => (
              <article key={plan.title} className="flex flex-col justify-between rounded-lg bg-white px-12 py-8 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <div className="w-full">
                <div className="mb-10">
                  <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">{plan.title}</h3>
                  <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                  <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">{plan.price}</span>
                  {plan.subtitle ? <p className="text-base leading-5 lg:text-2xl lg:leading-7">{plan.subtitle}</p> : null}
                </div>
                {plan.note ? <span className="text-sm font-medium leading-6 text-primary-500 lg:text-base lg:leading-7">{plan.note}</span> : null}
                <ul className="mb-20 list-disc">
                  {plan.items.map((item) => (
                    <li key={item} className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="secondary-button !justify-center">
                Contáctanos
              </Link>
            </article>
          ))}
            <article className="flex flex-col justify-between rounded-lg bg-white px-12 py-8 shadow-lg xl:col-span-3" data-animate="fadeInFromBottom" data-delay="0.24">
            <div className="w-full">
              <div className="mb-10">
                <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">Plan Personalizado</h3>
                <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">
                  ¡Contáctanos para discutir un presupuesto!
                </span>
              </div>
              <ul className="mb-20 list-disc">
                <li className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">ConsultorÃ­a personalizada</li>
              </ul>
            </div>
            <Link href="/contact" className="secondary-button !justify-center">
              Contáctanos
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function PortfolioShowcase({ cards }: PortfolioShowcaseProps) {
  return (
      <section className="projects-scroller relative mt-4 mb-24 lg:mb-32 lg:min-h-[260vh]">
        <div id="projects-container" className="site-shell portfolio-stack rounded-2xl">
          {cards.map((card, index) => (
            <article
              key={card.name}
              className="portfolio-card group/card flex flex-col justify-end p-5 md:p-6 lg:p-8"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), url(${card.image})`,
                zIndex: cards.length - index
              }}
              data-animate="fadeIn"
              data-delay={String(index * 0.03)}
            >
              <div className="portfolio-btn">
                <div className="btn-content">
                  <span className="hidden text-sm text-nowrap group-hover/card:block group-focus-within/card:block">Ver proyecto</span>
                  <ArrowRightIcon className="size-4" />
                </div>
              </div>
            <div className="portfolio-info">
              <div className="project-logo">{card.name}</div>
              <p className="portfolio-year">{card.year}</p>
              <p className="portfolio-text">{card.description}</p>
              <div className="portfolio-tags">
                {card.tags.map((tag) => (
                  <p key={tag} className="tag">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-primary-200/50 blur-3xl" aria-hidden="true" />
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16">
        <div className="faqs-info mb-10 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Dudas de nuestros usuarios</span>
          <h2 className="type-section-title mt-4">
            Preguntas más <span className="text-secondary-500">frecuentes</span>
          </h2>
        </div>
        <div className="flex flex-col items-start justify-center gap-8 sm:flex-row lg:gap-12">
          <div className="h-full w-full lg:max-w-[620px]">
            {faqsData.map(([question, answer], index) => (
              <article key={question} className="mb-4 last:mb-0">
                <div className="accordion" data-open={openIndex === index} data-animate="fadeInFromBottomSm" data-delay={String(index * 0.04)}>
                  <button type="button" className="accordion__title" onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}>
                    <span>{question}</span>
                    <span className="arrow">v</span>
                  </button>
                  <div className="details__content">
                    <p className="accordion__description">{answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="faqs-image w-full" data-animate="fadeInFromRight" data-delay="0.18">
            <div className="relative h-[430px] w-full">
              <Image src={referenceAssets.faq} alt="Preguntas frecuentes" fill className="h-full w-full object-contain object-center" sizes="516px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactPageSection() {
  return (
    <section className="text-body-color" id="contact">
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16">
        <div className="contact mb-[26px] flex flex-col gap-4 text-center sm:mb-20 sm:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker">Contáctanos</span>
          <h2 className="type-section-title">
            ¿Tienes algún <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            ¡Nosotros podemos ayudarte! Abarcamos gran parte de la Ciudad de México y alrededores.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
          <div className="axolotl-info flex w-full flex-col gap-4 lg:gap-8" data-animate="fadeIn">
            <ContactInfoColumn label="Correo electrónico" value={sharedSite.overlay.email} icon="mail" />
            <ContactInfoColumn label="Teléfono" value={sharedSite.overlay.phone} icon="phone" />
            <ContactInfoColumn label="Ubicación" value={`${sharedSite.overlay.location}, ${sharedSite.overlay.city}`} icon="location" />
          </div>
          <div className="col-span-1 w-full sm:col-span-2" data-animate="fadeInFromRight" data-delay="0.12">
            <form className="flex w-full flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Nombre *" placeholder="Nombre" />
                <FormField label="Apellidos *" placeholder="Apellidos" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Correo electrónico *" placeholder="Correo electrónico" type="email" />
                <FormField label="Número de teléfono *" placeholder="Número de teléfono" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mensaje *</label>
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className="w-full rounded-[14px] border border-gray-300 px-4 py-3 text-[15px] outline-none transition-colors duration-200 focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                className="w-fit rounded-[5px] border border-primary-500 bg-primary-500 px-6 py-2 font-bold text-primary-50 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white hover:text-primary-500"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
        <div className="contact-map mt-8 h-[250px] w-full overflow-hidden rounded-xl sm:mt-12 sm:h-[300px] md:h-[350px] lg:mt-16 lg:h-[400px]" data-animate="fadeIn" data-delay="0.2">
          <iframe
            title="Ubicación"
            src={MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function CtaCard({ dual = false }: CtaCardProps) {
  return (
    <section className="soft-section relative bg-primary-50">
      <div className="section site-shell relative z-20 flex flex-col items-center justify-center gap-6 py-14 lg:py-[105px]">
        <article className="flex w-full flex-col gap-6 rounded-[29px] border border-white bg-gradient-to-br from-transparent from-20% to-white/70 px-6 py-12 text-center sm:px-10 md:py-14" data-animate="fadeIn">
          <span className="type-section-title xl:text-[34px] xl:leading-[40px]">
            ¿Estás listo para llevar tus ideas al siguiente nivel?
          </span>
          <p className="type-body" data-animate="fadeInFromBottomSm" style={{ animationDelay: "100ms" }}>
            Hablemos y descubre cómo podemos ayudarte. O explora nuestras opciones y encuentra la solución perfecta para tu negocio.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-x-6 gap-y-2.5 text-sm xs:flex-row xl:text-base" data-animate="fadeInFromBottomSm" style={{ animationDelay: "180ms" }}>
            <Link className="primary-button max-w-[150px]" href="/contact">
              Contáctanos
            </Link>
            {dual ? (
              <Link
                href="/plans"
                className="rounded-[5px] border-2 border-primary-500 px-5 py-2 font-semibold text-primary-500 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-primary-600 hover:text-white"
              >
                Nuestros planes
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#212529]">
      <div className="section mx-auto flex max-w-7xl flex-col justify-between md:flex-row md:flex-wrap md:pt-[90px] md:pb-6 xl:flex-nowrap lg:pb-[76px]">
        <div className="min-w-0 flex-1 md:min-w-[530px]">
          <div className="mb-4 flex items-center gap-3">
            <div className="logo-mark white-mark">{sharedSite.brand.short}</div>
            <span className="text-xl font-normal text-white">{sharedSite.brand.name}</span>
          </div>
          <p className="text-sm leading-6 text-white">{sharedSite.footer.body}</p>
        </div>
        <div className="grow pt-5">
          <span className="mb-[15px] inline-block text-xl font-normal leading-6 text-primary-300">Menú</span>
          <ul className="flex flex-col gap-y-[15px]">
            {sharedSite.footerMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white transition-colors hover:text-primary-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grow pt-5 py-[23px]">
          <span className="mb-[15px] inline-block text-xl font-normal leading-6 text-primary-300">Contacto</span>
          <ul className="mb-[15px] flex flex-col gap-y-[15px] text-sm text-white">
            <li>{sharedSite.overlay.email}</li>
            <li>
              <a href={`tel:${sharedSite.overlay.phoneRaw}`} className="hover:underline">
                {sharedSite.overlay.phone}
              </a>
            </li>
          </ul>
          <ul className="flex gap-x-5">
            {sharedSite.socials.map((social) => (
              <li key={social.label} className="rounded-[5px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20">
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="grid size-[29px] place-content-center text-white">
                  <SocialIcon type={social.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section border-t border-[#DADADA]">
        <p className="py-[30px] text-center text-white">{sharedSite.footer.legal}</p>
      </div>
    </footer>
  );
}

function StickyWhatsApp() {
  return (
    <div className="schedule group bottom-10 hidden md:flex">
      <div className="schedule__message hidden transition-opacity duration-300 group-hover:pointer-events-none group-hover:opacity-0 md:flex">
        {sharedSite.sticky.message}
      </div>
      <a
        className="button-sticky whatsapp peer z-40 flex rounded-full px-4 group-hover:px-4"
        href={sharedSite.sticky.href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat por WhatsApp"
      >
        <span className="grid size-10 place-content-center rounded-full bg-white text-[#19c750]">
          <WhatsAppIcon className="size-7" />
        </span>
        <span className="button-sticky-label">{sharedSite.sticky.label}</span>
      </a>
    </div>
  );
}

function FormField({ label, placeholder, type = "text" }: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
      />
    </div>
  );
}

function ContactInfo({ label, value, icon }: ContactInfoProps) {
  return (
    <div className="flex w-full items-start gap-4">
      <ContactIcon type={icon} />
      <div>
        <span className="mb-1 inline-block font-semibold">{label}</span>
        <p className="text-black">{value}</p>
      </div>
    </div>
  );
}

function ContactInfoColumn({ label, value, icon }: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <ContactIcon type={icon} />
      <h3 className="text-lg font-bold sm:text-xl">{label}</h3>
      <p className="text-sm text-gray-600 sm:text-base">{value}</p>
    </div>
  );
}

function HeroArtwork() {
  return <Image src={referenceAssets.hero.home} alt="AxolotlCode - Hero" width={432} height={432} className="w-full" priority />;
}

function OrbBackground() {
  return (
    <div className="background">
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function HeroGradients() {
  return (
    <>
      <div className="hero-gradient hero-gradient-bottom" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-bottom" />
      </div>
      <div className="hero-gradient hero-gradient-top" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-top" />
      </div>
    </>
  );
}

function PortfolioGradients() {
  return (
    <>
      <svg width="910" height="678" viewBox="0 0 910 678" fill="none" className="fixed -top-70 -z-10 blur-2xl">
        <rect
          opacity="0.3"
          x="-90.6299"
          y="-243.33"
          width="1155"
          height="677.995"
          transform="rotate(30 -90.6299 -243.33)"
          fill="url(#paint0_linear_33_158)"
        />
        <defs>
          <linearGradient id="paint0_linear_33_158" x1="190.872" y1="599.909" x2="782.863" y2="-408.578" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF80B5" />
            <stop offset="1" stopColor="#9089FC" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="1504" height="806" viewBox="0 0 1504 806" fill="none">
        <rect opacity="0.3" x="718.5" y="64" width="1155" height="678" fill="url(#paint0_linear_33_152)" />
        <defs>
          <linearGradient id="paint0_linear_33_152" x1="1000" y1="907.245" x2="1592" y2="-101.245" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF80B5" />
            <stop offset="1" stopColor="#9089FC" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}













