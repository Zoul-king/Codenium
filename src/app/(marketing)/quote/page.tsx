import { ContactStrip } from "@/features/marketing/components/contact-form";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { quotePage } from "@/features/marketing/data/quote";
import { createMetadata } from "@/features/marketing/lib/metadata";
import { QuoteBuilder } from "@/features/quotes/components/quote-builder";

export const metadata = createMetadata(quotePage);

export default function QuotePage() {
  return (
    <MarketingShell headerVariant={quotePage.headerVariant}>
      <Hero hero={quotePage.hero} />
      <QuoteBuilder />
      <ContactStrip />
    </MarketingShell>
  );
}
