import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { PortfolioShowcase } from "@/features/marketing/components/portfolio-showcase";
import { portfolioCards, portfolioPage } from "@/features/marketing/data/portfolio";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(portfolioPage);

export default function PortfolioPage() {
  return (
    <MarketingShell headerVariant={portfolioPage.headerVariant}>
      <Hero hero={portfolioPage.hero} />
      <PortfolioShowcase cards={portfolioCards} />
    </MarketingShell>
  );
}
