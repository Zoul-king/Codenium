import { Cta } from "@/features/marketing/components/cta";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { Pricing } from "@/features/marketing/components/pricing";
import { ServicesPricing } from "@/features/marketing/components/services-pricing";
import { plansPage } from "@/features/marketing/data/plans";
import {
  applyPlanTextOverrides,
  buildManagedPlanCatalog,
  cloneManagedPlanCatalog,
  defaultManagedPlans,
  mergeManagedPlanCatalog,
  type PersistedPlanConfig
} from "@/features/marketing/lib/plan-catalog";
import { buildServicesPricing } from "@/features/marketing/lib/site-content";
import { createMetadata } from "@/features/marketing/lib/metadata";
import { db } from "@/lib/db";
import {
  getManagedPlanTexts,
  getManagedServices
} from "@/server/services/site-content-service";

export const metadata = createMetadata(plansPage);

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const [planConfigsRaw, planTexts, services] = await Promise.all([
    db.planConfig.findMany({ orderBy: { key: "asc" } }).catch(() => []),
    getManagedPlanTexts(),
    getManagedServices()
  ]);

  const planConfigs: PersistedPlanConfig[] = planConfigsRaw.map((config) => ({
    id: config.key,
    profile: config.profile === "BUSINESS" ? "business" : "personal",
    setupFee: config.setupFee,
    monthlyFee: config.monthlyFee,
    discountPercentage: config.discountPercentage,
    active: config.active
  }));

  const baseCatalog =
    planConfigs.length > 0 ? mergeManagedPlanCatalog(planConfigs) : cloneManagedPlanCatalog(defaultManagedPlans);
  const withText = applyPlanTextOverrides(baseCatalog, planTexts);
  const pricingPlans = buildManagedPlanCatalog(withText);
  const servicesPricing = buildServicesPricing(services);

  return (
    <MarketingShell headerVariant={plansPage.headerVariant}>
      <Hero hero={plansPage.hero} />
      <Pricing plans={pricingPlans} layout="stacked" />
      <ServicesPricing items={servicesPricing} />
      <Cta />
    </MarketingShell>
  );
}
