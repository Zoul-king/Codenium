import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { PortfolioShowcase } from "@/features/marketing/components/portfolio-showcase";
import { portfolioPage } from "@/features/marketing/data/portfolio";
import { buildPortfolioCards } from "@/features/marketing/lib/site-content";
import { createMetadata } from "@/features/marketing/lib/metadata";
import { getManagedPortfolio } from "@/server/services/site-content-service";

export const metadata = createMetadata(portfolioPage);

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const cards = buildPortfolioCards(await getManagedPortfolio());

  return (
    <MarketingShell headerVariant={portfolioPage.headerVariant}>
      <Hero hero={portfolioPage.hero} />
      <PortfolioShowcase cards={cards} />
    </MarketingShell>
  );
}
