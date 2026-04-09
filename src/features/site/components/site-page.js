"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, CheckIcon, ContactIcon, ServiceIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ReferenceFooter } from "@/features/site/components/reference-footer";
import { ReferenceHeader } from "@/features/site/components/reference-header";
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
    body: "Servicio técnico especializado en mantenimiento, resolucion de problemas y optimización de sistemas informáticos.",
    icon: "support"
  },
  {
    title: "Incubadora",
    body: "Mentoría y apoyo para startups, acelerando su crecimiento con estrategias digitales innovadoras.",
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
      "Desarrollamos tecnología con sello mexicano, creando soluciones innovadoras que transforman vidas y elevan el potencial de personas, empresas y comunidades."
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

export function SitePage({ page }) {
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
        {page.sections.includes("portfolioCards") && <PortfolioShowcase cards={page.hero.cards} />}
        {page.sections.includes("faq") && <FaqSection />}
        {page.sections.includes("contactForm") && <ContactPageSection />}
      </main>
      <ReferenceFooter />
      <StickyWhatsApp />
    </div>
  );
}

function Header({ page, open, setOpen }) {
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

function Hero({ page }) {
  if (page.hero.kind === "home") {
    return (
        <section className="section soft-section relative flex min-h-dvh items-center justify-center overflow-hidden pt-[96px]">
          <div className="site-shell background__waves relative flex flex-col items-center gap-6 pt-8 pb-[120px] md:flex-row lg:gap-10 lg:pt-14 lg:pb-[160px]">
            <article className="hero-text flex w-full max-w-[620px] flex-col items-center gap-6 text-center md:items-start md:gap-8 md:text-left" data-animate="fadeInFromLeft">
              <h1 className="text-[40px] font-normal leading-[0.92] tracking-[-0.05em] md:text-[50px] lg:text-[68px] lg:leading-[56px]">{page.hero.title}</h1>
              <p className="max-w-[640px] text-[18px] leading-8 font-normal lg:text-[19px]">{page.hero.body}</p>
              <div className="flex flex-row gap-4">
              <Link className="primary-button" href={page.hero.primaryCta.href}>
                {page.hero.primaryCta.label}
              </Link>
              <Link className="secondary-button" href={page.hero.secondaryCta.href}>
                {page.hero.secondaryCta.label}
              </Link>
            </div>
          </article>
          <div className="hero-image hidden max-h-[400px] w-full max-w-[400px] md:block" data-animate="fadeInFromRight">
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
          <h1 className="mt-16 mb-5 text-center text-[40px] font-normal leading-[0.95] tracking-[-0.05em] lg:mt-28 lg:mb-7 lg:text-[76px]" data-animate="fadeIn">
                  {page.hero.title}
                </h1>
          <p className="mx-auto mb-16 max-w-4xl text-center text-[15px] leading-7 md:text-base lg:mb-24" data-animate="fadeIn" data-delay="0.1">
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
        <div className="hero relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-[170px] text-center md:py-[125px] xl:py-[220px]" data-animate="fadeIn">
          <h1 className="mb-6 text-[40px] font-normal leading-[0.96] md:text-[52px] md:leading-[62px]">
            {page.hero.title}
            {page.hero.accent ? <span className="text-primary-200"> {page.hero.accent}</span> : null}
          </h1>
          <p className="max-w-[900px] text-base font-normal leading-7 md:text-lg md:leading-8">{page.hero.body}</p>
        </div>
      </section>
    );
}

function ServicesSection() {
  return (
    <section className="section soft-section">
      <div className="site-shell py-16">
        <div className="mb-14 text-center" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Novedades</span>
          <h2 className="text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">Que ofrecemos?</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
              <article key={service.title} className="service-card" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <ServiceIcon type={service.icon} />
              <h3 className="text-[20px] font-normal leading-7 lg:text-[24px] lg:leading-[30px]">{service.title}</h3>
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
        <div className="site-shell flex min-h-[58vh] flex-col items-center justify-between gap-x-7 gap-y-12 py-14 md:flex-row">
        <article className="flex w-full flex-col gap-4" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Clientes satisfechos</span>
          <h2 className="text-[22px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
            Marcas que <span className="text-secondary-500">confiaron</span> en nuestro trabajo
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nos enorgullece haber desarrollado sitios web para empresas que valoran la calidad. Estos son algunos de los clientes que confiaron en nosotros y quedaron satisfechos con los resultados.
          </p>
        </article>
        <article className="slider" data-animate="fadeInFromBottom">
          <div className="track">
            {repeated.map((item, index) => (
              <div key={`${item}-${index}`} className="item cursor-pointer">
                <div className="logo-chip">{item}</div>
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
        <div className="section site-shell relative z-20 flex flex-col items-center gap-x-5 gap-y-10 py-14 sm:flex-row lg:gap-10 xl:py-14">
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
            <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Por que AxolotlCode?</span>
            <h2 className="text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
              En AxolotlCode construimos <span className="text-secondary-500">mas que software</span>
            </h2>
            <p className="max-w-2xl text-sm text-body-color sm:text-base">
              Creamos soluciones que impulsan tu negocio hacia el exito. Nuestro equipo combina innovacion, calidad y compromiso para desarrollar herramientas tecnologicas personalizadas.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-1">
            {benefitBulletsData.map(([lead, text]) => (
              <div key={lead} className="flex items-center gap-4 rounded-lg p-2 transition-colors duration-300 hover:bg-primary-500/10 md:p-1">
                <div className="rounded-full bg-secondary-500/10 p-2 text-secondary-500">
                  <CheckIcon />
                </div>
                <span className="text-[16px] font-normal text-gray-700 sm:text-sm lg:text-base">
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
      <div className="site-shell flex flex-col gap-5 py-14 lg:flex-row lg:gap-10 xl:py-14">
        <article className="flex w-full flex-col items-center gap-4 text-center lg:max-w-[500px] lg:items-start lg:gap-5 lg:text-left" data-animate="fadeInFromLeft">
          <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Contactanos</span>
          <h2 className="text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
            Tienes algun <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-[420px] text-sm leading-6 text-body-color sm:text-[15px] lg:leading-7">
            Nosotros podemos ayudarte. Abarcamos gran parte de la Ciudad de Mexico y alrededores.
          </p>
          <Link href="/contact" className="contact-button">
            Enviar mensaje
          </Link>
        </article>
        <article className="grid w-full grid-cols-1 gap-4 md:grid-cols-2" data-animate="fadeInFromRight" data-delay="0.12">
          <div className="overflow-hidden rounded-[20px] shadow-md md:col-span-2">
            <iframe
              title="Ubicacion"
              src="https://www.google.com/maps?q=Nezahualcoyotl%20Estado%20de%20Mexico&z=11&output=embed"
              width="100%"
              height="100%"
              className="min-h-[320px]"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-md">
            <ContactInfo label="Correo electronico" value={sharedSite.overlay.email} icon="mail" />
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-md">
            <ContactInfo label="Telefono" value={sharedSite.overlay.phone} icon="phone" />
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-md md:col-span-2">
            <ContactInfo label="Ubicacion" value={`${sharedSite.overlay.location}, ${sharedSite.overlay.city}`} icon="location" />
          </div>
        </article>
      </div>
    </section>
  );
}
function AboutStory() {
  return (
    <section className="section soft-section bg-foreground">
        <div className="site-shell grid grid-cols-1 items-center gap-8 py-10 md:gap-10 xl:py-14 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="flex flex-col gap-5" data-animate="fadeInFromLeft">
          <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Sobre nosotros</span>
          <h2 className="text-[22px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
            Conoce nuestra <span className="text-secondary-500">historia</span>
          </h2>
          <p className="text-sm leading-6 text-body-color sm:text-base lg:leading-7">
            Hoy seguimos trabajando con la misma pasion y determinacion, ayudando a empresas a alcanzar sus objetivos a traves de herramientas digitales innovadoras y personalizadas.
          </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {aboutCardsData.map((card, index) => (
                <article key={card.title} className="rounded-lg bg-white px-5 py-4 text-body-color shadow-[0_4px_10px_0_rgba(148,148,148,0.13)] backdrop-blur-[20px]" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
                <h3 className="mb-2 text-[20px] font-normal leading-7">{card.title}</h3>
                <p className="text-sm leading-6 lg:text-[15px] lg:leading-7">{card.body}</p>
              </article>
            ))}
          </div>
        </article>
          <div className="relative min-h-[400px] overflow-hidden rounded-[28px]" data-animate="fadeInFromRight">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
            alt="Equipo trabajando"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 520px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="soft-section bg-foreground">
        <div className="section site-shell py-14 xl:py-14">
          <div className="mb-8 text-center" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-[24px]">Nuestros pilares</span>
          <h2 className="mt-4 text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
            Conoce nuestra <span className="text-secondary-500">mision y vision</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {missionVisionData.map((item, index) => (
            <article
              key={item.title}
              className="px-6 py-4 text-center text-body-color shadow-[0_4px_10px_0_rgba(148,148,148,0.13)] backdrop-blur-[20px] md:text-left"
              data-animate="fadeInFromRight"
                data-delay={String(index * 0.12)}
              >
              <h3 className="text-[20px] font-normal leading-7 xl:text-[24px] xl:leading-8">{item.title}</h3>
              <span className="mt-3 inline-block text-sm leading-6 xl:text-[15px] xl:leading-7">{item.body}</span>
            </article>
          ))}
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
                  Este paso nos permite dar estructura, claridad y una base real para una ejecucion ordenada.
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
    "Descubrimos juntos lo que requiere tu proyecto y como podemos lograr una solucion clara desde el inicio.",
    "Estructuramos tus ideas para darle vida a tu proyecto con una base funcional y ordenada.",
    "Convertimos la estructura en una propuesta visual consistente con tu marca y tus objetivos.",
    "Definimos textos, mensajes y recursos que ayudan a comunicar mejor el valor del producto.",
    "Construimos la solucion con foco en rendimiento, escalabilidad y experiencia de usuario.",
    "Validamos cada detalle antes del lanzamiento para asegurar estabilidad y calidad.",
    "Damos seguimiento para mantener la solucion actualizada y lista para crecer."
  ];

  return (
    <section className="soft-section relative overflow-hidden bg-foreground">
      <div className="timeline section site-shell relative z-20 py-14 text-center">
        <span className="text-base font-normal leading-5 text-primary-500 lg:text-[24px]" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="mt-4 text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]" data-animate="fadeIn">
          Como lo <span className="text-secondary-500">hacemos</span>?
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
                <div className="relative h-[108px] w-[108px] rounded-full border border-primary-400 bg-white p-1.5 shadow-[0_10px_24px_rgba(242,61,109,0.08)]">
                  <div className="h-[94px] w-[94px] rounded-full bg-gradient-to-br from-primary-100 to-secondary-500/35" />
                  <span className="absolute right-0 bottom-0 inline-grid size-[42px] place-content-center rounded-full bg-primary-500 text-[20px] font-normal text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[280px] text-[17px] font-normal leading-8">{step}</span>
                <p className="max-w-[280px] text-[14px] leading-7">{stepDescriptions[index]}</p>
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
        <div className="services section site-shell py-14 text-center">
        <div className="info" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-2xl lg:leading-7">Nuestros servicios</span>
          <h2 className="mt-4 mb-8 text-[21px] font-normal leading-8 lg:text-[32px] lg:leading-[38px]">
            Como podemos <span className="text-secondary-500">ayudarte</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
              <article key={service.title} className="relative w-full rounded-lg bg-white p-6 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <div className="relative z-10 flex items-start gap-5">
                <ServiceIcon type={service.icon} />
                <div>
                  <h3 className="text-lg font-normal leading-6 xl:text-[21px] xl:leading-7">{service.title}</h3>
                  <p className="mt-4 text-sm leading-6 xl:text-[14px] xl:leading-7">{service.body}</p>
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
      <div className="section site-shell relative z-20 py-14 text-black">
        <div className="mb-10 text-center lg:text-left" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-2xl lg:leading-7">Nuestros planes</span>
          <h2 className="mt-4 text-[21px] font-normal leading-[32px] lg:text-[32px] lg:leading-[38px]">
            Que <span className="text-secondary-500">ofrecemos</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plansData.map((plan, index) => (
              <article key={plan.title} className="flex flex-col justify-between rounded-lg bg-white px-7 py-6 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <div className="w-full">
                <div className="mb-10">
                  <h3 className="text-lg font-normal leading-6 lg:text-[21px] lg:leading-7">{plan.title}</h3>
                  <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                  <span className="mb-2.5 block text-[20px] font-normal leading-[28px] lg:text-[24px] lg:leading-[30px]">{plan.price}</span>
                  {plan.subtitle ? <p className="text-[15px] leading-5 lg:text-[18px]">{plan.subtitle}</p> : null}
                </div>
                {plan.note ? <span className="text-sm leading-6 text-primary-500 lg:text-base lg:leading-7">{plan.note}</span> : null}
                <ul className="mb-14 list-disc">
                  {plan.items.map((item) => (
                    <li key={item} className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="secondary-button !justify-center">
                Contactanos
              </Link>
            </article>
          ))}
            <article className="flex flex-col justify-between rounded-lg bg-white px-7 py-6 shadow-lg xl:col-span-3" data-animate="fadeInFromBottom" data-delay="0.24">
            <div className="w-full">
              <div className="mb-10">
                <h3 className="text-lg font-normal leading-6 lg:text-[21px] lg:leading-7">Plan personalizado</h3>
                <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                <span className="mb-2.5 block text-[20px] font-normal leading-[28px] lg:text-[24px] lg:leading-[30px]">
                  Contactanos para discutir un presupuesto
                </span>
              </div>
              <ul className="mb-14 list-disc">
                <li className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">Consultoria personalizada</li>
              </ul>
            </div>
            <Link href="/contact" className="secondary-button !justify-center">
              Contactanos
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function PortfolioShowcase({ cards }) {
  return (
      <section className="projects-scroller relative mt-2 mb-20 lg:min-h-[260vh]">
        <div id="projects-container" className="site-shell portfolio-stack rounded-2xl">
          {cards.map((card, index) => (
            <article
              key={card.name}
              className="portfolio-card group/card flex flex-col justify-end p-4 lg:p-8"
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
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-10 md:px-6 lg:px-8 lg:py-12">
        <div className="faqs-info mb-10 text-center" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-2xl lg:leading-7">Dudas de nuestros usuarios</span>
          <h2 className="mt-4 text-[21px] font-normal leading-[32px] lg:text-[32px] lg:leading-[38px]">
            Preguntas mas <span className="text-secondary-500">frecuentes</span>
          </h2>
        </div>
          <div className="flex flex-col items-start justify-center gap-8 sm:flex-row lg:gap-10">
            <div className="h-full w-full">
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
            <div className="w-full" data-animate="fadeInFromRight" data-delay="0.18">
            <div className="relative h-[430px] w-full">
              <Image
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
                alt="FAQ illustration"
                fill
                className="h-full w-full object-contain object-center"
                sizes="516px"
              />
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
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-10 md:px-6 lg:px-8 lg:py-12">
        <div className="mb-[26px] flex flex-col gap-4 text-center sm:mb-14 sm:text-left" data-animate="fadeInFromTop">
          <span className="text-base leading-5 text-primary-500 lg:text-2xl lg:leading-7">Contactanos</span>
          <h2 className="text-[21px] font-normal leading-[32px] lg:text-[32px] lg:leading-[38px]">
            Tienes algun <span className="text-secondary-500">proyecto</span> en mente?
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nosotros podemos ayudarte. Abarcamos gran parte de la Ciudad de Mexico y alrededores.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-10">
            <div className="flex w-full flex-col gap-4 lg:gap-8" data-animate="fadeInFromLeft">
            <ContactInfoColumn label="Correo electronico" value={sharedSite.overlay.email} icon="mail" />
            <ContactInfoColumn label="Telefono" value={sharedSite.overlay.phone} icon="phone" />
            <ContactInfoColumn label="Ubicacion" value={`${sharedSite.overlay.location}, ${sharedSite.overlay.city}`} icon="location" />
          </div>
            <div className="col-span-1 w-full sm:col-span-2" data-animate="fadeInFromRight" data-delay="0.12">
            <form className="flex w-full flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Nombre *" placeholder="Nombre" />
                <FormField label="Apellidos *" placeholder="Apellidos" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Correo electronico *" placeholder="Correo electronico" type="email" />
                <FormField label="Numero de telefono *" placeholder="Numero de telefono" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-normal text-gray-700">Mensaje *</label>
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                className="w-fit rounded-[5px] border border-primary-500 bg-primary-500 px-5 py-1 font-normal text-primary-50 transition-all duration-500 ease-in-out hover:scale-[1.02] hover:bg-white hover:text-primary-500"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
          <div className="mt-8 h-[220px] w-full overflow-hidden rounded-xl sm:mt-10 sm:h-[260px] lg:mt-12 lg:h-[320px]" data-animate="fadeInFromBottomSm" data-delay="0.2">
          <iframe
            title="Ubicacion"
            src="https://www.google.com/maps?q=Ciudad%20de%20Mexico&z=11&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function CtaCard({ dual = false }) {
  return (
    <section className="soft-section relative bg-primary-50">
      <div className="section site-shell relative z-20 flex flex-col items-center justify-center gap-6 xl:py-[105px]">
        <article className="flex w-full flex-col gap-6 rounded-[29px] border border-white bg-gradient-to-br from-transparent from-20% to-white/70 px-[34px] py-12 text-center" data-animate="fadeIn">
          <span className="text-[22px] font-normal leading-8 xl:text-[34px] xl:leading-[40px]">
            Estas listo para llevar tus ideas al siguiente nivel?
          </span>
          <p className="text-sm leading-6 xl:text-base xl:leading-7" data-animate="fadeInFromBottomSm" style={{ animationDelay: "100ms" }}>
            Hablemos y descubre como podemos ayudarte. O explora nuestras opciones y encuentra la solucion perfecta para tu negocio.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-x-6 gap-y-2.5 text-sm xs:flex-row xl:text-base" data-animate="fadeInFromBottomSm" style={{ animationDelay: "180ms" }}>
            <Link className="primary-button max-w-[150px]" href="/contact">
              Contactanos
            </Link>
            {dual ? (
              <Link
                href="/plans"
                className="rounded-[5px] border-2 border-primary-500 px-5 py-1.5 font-normal text-primary-500 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-primary-600 hover:text-white"
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
          <span className="mb-[15px] inline-block text-xl font-normal leading-6 text-primary-300">Menu</span>
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

function FormField({ label, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-normal text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
      />
    </div>
  );
}

function ContactInfo({ label, value, icon }) {
  return (
    <div className="flex w-full items-start gap-4">
      <ContactIcon type={icon} />
      <div>
        <span className="mb-1 inline-block font-normal">{label}</span>
        <p className="text-black">{value}</p>
      </div>
    </div>
  );
}

function ContactInfoColumn({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <ContactIcon type={icon} />
      <h3 className="text-lg font-normal sm:text-xl">{label}</h3>
      <p className="text-sm text-gray-600 sm:text-base">{value}</p>
    </div>
  );
}

function HeroArtwork() {
  return <div className="hero-artwork" />;
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
