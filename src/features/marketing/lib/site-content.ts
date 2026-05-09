import { clientLogos, services as defaultServices } from "@/features/marketing/data/home";
import { portfolioCards } from "@/features/marketing/data/portfolio";
import { servicesPricing as defaultServicesPricing } from "@/features/marketing/data/plans";
import type {
  ClientLogo,
  PortfolioCard,
  ServiceItem,
  ServicePricingItem
} from "@/features/marketing/types";

export interface ManagedClientLogo {
  id: string;
  alt: string;
  src?: string;
  href?: string;
  active: boolean;
  order: number;
}

export interface ManagedPortfolioCard {
  id: string;
  name: string;
  year: string;
  description: string;
  tags: string[];
  image: string;
  logo?: string;
  href?: string;
  active: boolean;
  order: number;
}

export interface ManagedServicePricingItem {
  id: string;
  title: string;
  price: string;
  subtitle: string;
  description: string;
  active: boolean;
  order: number;
}

export interface ManagedPlanText {
  id: string;
  title: string;
  note?: string;
  customPriceLabel?: string;
  items: string[];
}

export type ManagedPlanTexts = Record<string, ManagedPlanText>;

export type SiteContentKey = "logos" | "portfolio" | "services-pricing" | "plans-text";

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const defaultManagedLogos: ManagedClientLogo[] = clientLogos.map((logo, index) => ({
  id: `logo-${slug(logo.alt) || index}`,
  alt: logo.alt,
  src: logo.src,
  href: logo.href,
  active: true,
  order: index
}));

export const defaultManagedPortfolio: ManagedPortfolioCard[] = portfolioCards.map((card, index) => ({
  id: `portfolio-${slug(card.name) || index}`,
  name: card.name,
  year: card.year,
  description: card.description,
  tags: [...card.tags],
  image: card.image,
  logo: card.logo,
  href: card.href,
  active: true,
  order: index
}));

export const defaultManagedServices: ManagedServicePricingItem[] = defaultServicesPricing.map(
  (item, index) => ({
    id: `service-${slug(item.title) || index}`,
    title: item.title,
    price: item.price,
    subtitle: item.subtitle,
    description: item.description,
    active: true,
    order: index
  })
);

export const defaultManagedPlanTexts: ManagedPlanTexts = {};

export function buildClientLogos(items: ManagedClientLogo[]): ClientLogo[] {
  return items
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ alt: item.alt, src: item.src, href: item.href }));
}

export function buildPortfolioCards(items: ManagedPortfolioCard[]): PortfolioCard[] {
  return items
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      name: item.name,
      year: item.year,
      description: item.description,
      tags: [...item.tags],
      image: item.image,
      logo: item.logo,
      href: item.href
    }));
}

export function buildServicesPricing(items: ManagedServicePricingItem[]): ServicePricingItem[] {
  return items
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      title: item.title,
      price: item.price,
      subtitle: item.subtitle,
      description: item.description
    }));
}

export function normalizeManagedLogos(value: unknown): ManagedClientLogo[] {
  if (!Array.isArray(value)) return cloneDefaultLogos();
  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const e = entry as Partial<ManagedClientLogo>;
      if (!e.alt || typeof e.alt !== "string") return null;
      return {
        id: typeof e.id === "string" && e.id ? e.id : `logo-${slug(e.alt) || index}`,
        alt: e.alt,
        src: typeof e.src === "string" ? e.src : undefined,
        href: typeof e.href === "string" ? e.href : undefined,
        active: typeof e.active === "boolean" ? e.active : true,
        order: typeof e.order === "number" ? e.order : index
      } satisfies ManagedClientLogo;
    })
    .filter((value): value is ManagedClientLogo => value !== null);
}

export function normalizeManagedPortfolio(value: unknown): ManagedPortfolioCard[] {
  if (!Array.isArray(value)) return cloneDefaultPortfolio();
  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const e = entry as Partial<ManagedPortfolioCard>;
      if (!e.name || typeof e.name !== "string") return null;
      return {
        id: typeof e.id === "string" && e.id ? e.id : `portfolio-${slug(e.name) || index}`,
        name: e.name,
        year: typeof e.year === "string" ? e.year : "",
        description: typeof e.description === "string" ? e.description : "",
        tags: Array.isArray(e.tags) ? e.tags.filter((t): t is string => typeof t === "string") : [],
        image: typeof e.image === "string" ? e.image : "",
        logo: typeof e.logo === "string" ? e.logo : undefined,
        href: typeof e.href === "string" ? e.href : undefined,
        active: typeof e.active === "boolean" ? e.active : true,
        order: typeof e.order === "number" ? e.order : index
      } satisfies ManagedPortfolioCard;
    })
    .filter((value): value is ManagedPortfolioCard => value !== null);
}

export function normalizeManagedServices(value: unknown): ManagedServicePricingItem[] {
  if (!Array.isArray(value)) return cloneDefaultServices();
  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const e = entry as Partial<ManagedServicePricingItem>;
      if (!e.title || typeof e.title !== "string") return null;
      return {
        id: typeof e.id === "string" && e.id ? e.id : `service-${slug(e.title) || index}`,
        title: e.title,
        price: typeof e.price === "string" ? e.price : "",
        subtitle: typeof e.subtitle === "string" ? e.subtitle : "",
        description: typeof e.description === "string" ? e.description : "",
        active: typeof e.active === "boolean" ? e.active : true,
        order: typeof e.order === "number" ? e.order : index
      } satisfies ManagedServicePricingItem;
    })
    .filter((value): value is ManagedServicePricingItem => value !== null);
}

export function normalizeManagedPlanTexts(value: unknown): ManagedPlanTexts {
  if (!value || typeof value !== "object") return {};
  const result: ManagedPlanTexts = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Partial<ManagedPlanText>;
    if (typeof e.title !== "string") continue;
    result[key] = {
      id: key,
      title: e.title,
      note: typeof e.note === "string" ? e.note : undefined,
      customPriceLabel: typeof e.customPriceLabel === "string" ? e.customPriceLabel : undefined,
      items: Array.isArray(e.items) ? e.items.filter((t): t is string => typeof t === "string") : []
    };
  }
  return result;
}

export function cloneDefaultLogos() {
  return defaultManagedLogos.map((logo) => ({ ...logo }));
}

export function cloneDefaultPortfolio() {
  return defaultManagedPortfolio.map((card) => ({ ...card, tags: [...card.tags] }));
}

export function cloneDefaultServices() {
  return defaultManagedServices.map((item) => ({ ...item }));
}

export { defaultServices };

export async function fetchManagedLogos(): Promise<ManagedClientLogo[]> {
  const res = await fetch("/api/site-content/logos", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los logos.");
  return normalizeManagedLogos(await res.json());
}

export async function saveManagedLogos(items: ManagedClientLogo[]) {
  const res = await fetch("/api/site-content/logos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error("No se pudieron guardar los logos.");
  return normalizeManagedLogos(await res.json());
}

export async function fetchManagedPortfolio(): Promise<ManagedPortfolioCard[]> {
  const res = await fetch("/api/site-content/portfolio", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el portafolio.");
  return normalizeManagedPortfolio(await res.json());
}

export async function saveManagedPortfolio(items: ManagedPortfolioCard[]) {
  const res = await fetch("/api/site-content/portfolio", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error("No se pudo guardar el portafolio.");
  return normalizeManagedPortfolio(await res.json());
}

export async function fetchManagedServicesPricing(): Promise<ManagedServicePricingItem[]> {
  const res = await fetch("/api/site-content/services", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los servicios.");
  return normalizeManagedServices(await res.json());
}

export async function saveManagedServicesPricing(items: ManagedServicePricingItem[]) {
  const res = await fetch("/api/site-content/services", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error("No se pudieron guardar los servicios.");
  return normalizeManagedServices(await res.json());
}

export async function fetchManagedPlanTexts(): Promise<ManagedPlanTexts> {
  const res = await fetch("/api/site-content/plans-text", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los textos.");
  return normalizeManagedPlanTexts(await res.json());
}

export async function saveManagedPlanTexts(value: ManagedPlanTexts) {
  const res = await fetch("/api/site-content/plans-text", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value)
  });
  if (!res.ok) throw new Error("No se pudieron guardar los textos.");
  return normalizeManagedPlanTexts(await res.json());
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: form });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "No se pudo subir la imagen.");
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}
