import type { ClientLogo } from "@/features/site/types";

const base = "/template-assets/axolotl";

export const referenceAssets = {
  logos: {
    pink: `${base}/logo-pink.webp`,
    white: `${base}/logo-white.webp`
  },
  hero: {
    home: `${base}/images/hero-home.webp`,
    about: `${base}/images/about-hero.webp`,
    plans: `${base}/images/plans-hero.webp`,
    contact: `${base}/images/contact-hero.webp`
  },
  serviceIcons: {
    code: `${base}/services/dev.svg`,
    consulting: `${base}/services/pencil.svg`,
    team: `${base}/services/person.svg`,
    spark: `${base}/services/start.svg`,
    support: `${base}/services/call.svg`,
    idea: `${base}/services/interrogatory.svg`
  },
  socialIcons: {
    instagram: `${base}/social/instagram.svg`,
    x: `${base}/social/x.svg`,
    facebook: `${base}/social/facebook.svg`,
    linkedin: `${base}/social/linkedin.svg`,
    tiktok: `${base}/social/tiktok.svg`
  },
  contactIcons: {
    mail: `${base}/contact/email.svg`,
    phone: `${base}/contact/phone.svg`,
    location: `${base}/contact/location.svg`
  },
  whatsapp: `${base}/whatsapp.svg`,
  gallery: [
    `${base}/images/section-1.webp`,
    `${base}/images/section-2.webp`,
    `${base}/images/section-3.webp`,
    `${base}/images/section-4.webp`
  ],
  about: {
    story: `${base}/images/about-story.webp`,
    company: `${base}/images/company.webp`
  },
  faq: `${base}/images/faq-image.webp`,
  timeline: [
    `${base}/images/time-step-1.webp`,
    `${base}/images/time-step-2.webp`,
    `${base}/images/time-step-3.webp`,
    `${base}/images/time-step-4.webp`,
    `${base}/images/time-step-5.webp`,
    `${base}/images/time-step-6.webp`,
    `${base}/images/time-step-7.webp`
  ]
} as const;

export const referenceLogoSlides: ClientLogo[] = [
  { src: `${base}/logos/icon-1.svg`, href: "https://goser.mx/", alt: "Goser" },
  { src: `${base}/logos/icon-2.png`, href: "https://disveruniformes.com.mx/", alt: "Disver Uniformes" },
  { src: `${base}/logos/icon-3.png`, alt: "Brand icon 3" },
  { src: `${base}/logos/icon-4.png`, alt: "Brand icon 4" },
  { src: `${base}/logos/icon-5.png`, href: "https://aurumtage.com/", alt: "Aurumtage" },
  { src: `${base}/logos/icon-7.png`, href: "https://sittycia.com/", alt: "Sittycia" },
  { src: `${base}/logos/icon-8.png`, href: "https://nutrition-lab.mx/", alt: "Nutrition Lab" },
  { src: `${base}/logos/larezza.svg`, href: "https://larezza.com/", alt: "Larezza" },
  { src: `${base}/logos/master-clean.svg`, href: "https://masterclean.mx/", alt: "Master Clean" },
  { src: `${base}/logos/valhui.png`, href: "https://valhui.com/", alt: "Valhui" }
];
