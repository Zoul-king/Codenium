import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { PrivacyCopy } from "@/features/marketing/components/privacy-copy";
import { privacyCopy, privacyPage } from "@/features/marketing/data/privacy";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(privacyPage);

export default function PrivacyPage() {
  return (
    <MarketingShell headerVariant={privacyPage.headerVariant}>
      <Hero hero={privacyPage.hero} />
      <PrivacyCopy items={privacyCopy} />
    </MarketingShell>
  );
}
