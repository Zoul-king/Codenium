import "server-only";

import { db } from "@/lib/db";
import {
  cloneDefaultLogos,
  cloneDefaultPortfolio,
  cloneDefaultServices,
  normalizeManagedLogos,
  normalizeManagedPlanTexts,
  normalizeManagedPortfolio,
  normalizeManagedServices,
  type ManagedClientLogo,
  type ManagedPlanTexts,
  type ManagedPortfolioCard,
  type ManagedServicePricingItem,
  type SiteContentKey
} from "@/features/marketing/lib/site-content";

async function readKey(key: SiteContentKey) {
  try {
    const row = await db.siteContent.findUnique({ where: { key } });
    return row?.data ?? null;
  } catch {
    return null;
  }
}

async function writeKey(key: SiteContentKey, data: unknown) {
  await db.siteContent.upsert({
    where: { key },
    update: { data: data as never },
    create: { key, data: data as never }
  });
}

export async function getManagedLogos(): Promise<ManagedClientLogo[]> {
  const data = await readKey("logos");
  if (!data) return cloneDefaultLogos();
  return normalizeManagedLogos(data);
}

export async function setManagedLogos(items: ManagedClientLogo[]) {
  const normalized = normalizeManagedLogos(items);
  await writeKey("logos", normalized);
  return normalized;
}

export async function getManagedPortfolio(): Promise<ManagedPortfolioCard[]> {
  const data = await readKey("portfolio");
  if (!data) return cloneDefaultPortfolio();
  return normalizeManagedPortfolio(data);
}

export async function setManagedPortfolio(items: ManagedPortfolioCard[]) {
  const normalized = normalizeManagedPortfolio(items);
  await writeKey("portfolio", normalized);
  return normalized;
}

export async function getManagedServices(): Promise<ManagedServicePricingItem[]> {
  const data = await readKey("services-pricing");
  if (!data) return cloneDefaultServices();
  return normalizeManagedServices(data);
}

export async function setManagedServices(items: ManagedServicePricingItem[]) {
  const normalized = normalizeManagedServices(items);
  await writeKey("services-pricing", normalized);
  return normalized;
}

export async function getManagedPlanTexts(): Promise<ManagedPlanTexts> {
  const data = await readKey("plans-text");
  if (!data) return {};
  return normalizeManagedPlanTexts(data);
}

export async function setManagedPlanTexts(value: ManagedPlanTexts) {
  const normalized = normalizeManagedPlanTexts(value);
  await writeKey("plans-text", normalized);
  return normalized;
}
