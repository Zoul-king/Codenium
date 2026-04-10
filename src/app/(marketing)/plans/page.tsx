import { Cta } from "@/features/marketing/components/cta";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { Pricing } from "@/features/marketing/components/pricing";
import { plansPage, pricingPlans } from "@/features/marketing/data/plans";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(plansPage);

export default function PlansPage() {
  return (
    <MarketingShell headerVariant={plansPage.headerVariant}>
      <Hero hero={plansPage.hero} />
      <Pricing plans={pricingPlans} />
      <Cta />
    </MarketingShell>

  );
}
