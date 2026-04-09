export type SocialIconType = "instagram" | "x" | "facebook" | "linkedin" | "tiktok";

export type ServiceIconType = "code" | "consulting" | "team" | "spark" | "support" | "idea";

export type ContactIconType = "mail" | "phone" | "location";

export type HeaderVariant = "pink" | "white";

export type PageSection =
  | "services"
  | "logos"
  | "benefits"
  | "contactStrip"
  | "aboutStory"
  | "missionVision"
  | "timeline"
  | "ctaDual"
  | "planServices"
  | "pricingPlans"
  | "ctaSingle"
  | "portfolioCards"
  | "faq"
  | "contactForm";

export type PageKey = "home" | "about" | "plans" | "portfolio" | "contact" | "privacy";

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

export interface CtaLink extends LinkItem {}

export interface SiteBrand {
  name: string;
  short: string;
}

export interface SiteOverlay {
  location: string;
  city: string;
  email: string;
  phone: string;
  phoneRaw: string;
}

export interface StickyContact {
  message: string;
  label: string;
  href: string;
}

export interface FooterContent {
  body: string;
  legal: string;
}

export interface SharedSite {
  brand: SiteBrand;
  menu: LinkItem[];
  footerMenu: LinkItem[];
  overlay: SiteOverlay;
  socials: SocialLink[];
  sticky: StickyContact;
  footer: FooterContent;
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

export interface HomeHero {
  kind: "home";
  title: string;
  body: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
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
  cards?: PortfolioCard[];
}

export type SiteHero = HomeHero | ImageHero | PortfolioHero;

export interface SitePageDefinition {
  key: PageKey;
  title: string;
  description: string;
  headerVariant: HeaderVariant;
  hero: SiteHero;
  sections: PageSection[];
}

export type SitePagesMap = Record<PageKey, SitePageDefinition>;

export interface ServiceItem {
  title: string;
  body: string;
  icon: ServiceIconType;
}

export type BenefitBullet = [title: string, body: string];

export interface AboutCard {
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

export type FaqItem = [question: string, answer: string];

export type AnimationName =
  | "fadeIn"
  | "fadeInFromTop"
  | "fadeInFromBottom"
  | "fadeInFromBottomSm"
  | "fadeInFromLeft"
  | "fadeInFromRight";
