export type SocialIconType = "instagram" | "x" | "facebook" | "linkedin" | "tiktok";

export type ServiceIconType = "code" | "consulting" | "team" | "spark" | "support" | "idea";

export type ContactIconType = "mail" | "phone" | "location";

export type HeaderVariant = "brand" | "white";

export interface LinkItem {
  label: string;
  href: string;
}

export interface SocialLink extends LinkItem {
  icon: SocialIconType;
}

export interface ClientLogo {
  src: string;
  alt: string;
  href?: string;
}

export interface ServiceItem {
  title: string;
  body: string;
  icon: ServiceIconType;
}

export interface BenefitItem {
  title: string;
  body: string;
}

export interface AboutBlock {
  title: string;
  body: string;
}

export interface TimelineStep {
  title: string;
  body: string;
}

export interface PlanItem {
  title: string;
  price: string;
  subtitle?: string;
  note?: string;
  items: string[];
}

export interface PortfolioCard {
  name: string;
  year: string;
  description: string;
  tags: string[];
  image: string;
  logo?: string;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteBrand {
  name: string;
  short: string;
}

export interface SiteContact {
  location: string;
  city: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
}

export interface SiteFooter {
  body: string;
  legal: string;
}

export interface SiteConfig {
  brand: SiteBrand;
  nav: LinkItem[];
  footerNav: LinkItem[];
  contact: SiteContact;
  socials: SocialLink[];
  footer: SiteFooter;
  sticky: {
    message: string;
    label: string;
    href: string;
  };
  assets: {
    brand: {
      pink: string;
      white: string;
    };
    hero: {
      home: string;
      about: string;
      plans: string;
      contact: string;
    };
    gallery: string[];
    about: {
      story: string;
      company: string;
    };
    faq: string;
    timeline: string[];
    logos: Record<string, string>;
  };
  mapEmbedUrl: string;
}

export interface HomeHero {
  kind: "home";
  title: string;
  body: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
}

export interface ImageHero {
  kind: "image";
  title: string;
  accent?: string;
  body: string;
  image: string;
}

export interface PortfolioHero {
  kind: "portfolio";
  title: string;
  body: string;
}

export type PageHero = HomeHero | ImageHero | PortfolioHero;

export interface PageMeta {
  title: string;
  description: string;
}

export interface MarketingPageData {
  slug: string;
  headerVariant: HeaderVariant;
  meta: PageMeta;
  hero: PageHero;
}

export type AnimationName =
  | "fadeIn"
  | "fadeInFromTop"
  | "fadeInFromBottom"
  | "fadeInFromBottomSm"
  | "fadeInFromLeft"
  | "fadeInFromRight";
