import { Benefits } from "@/features/marketing/components/benefits";
import { ContactStrip } from "@/features/marketing/components/contact-form";
import { Hero } from "@/features/marketing/components/hero";
import { Logos } from "@/features/marketing/components/logos";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { Services } from "@/features/marketing/components/services";
import { benefits, homePage, services } from "@/features/marketing/data/home";
import { buildClientLogos } from "@/features/marketing/lib/site-content";
import { createMetadata } from "@/features/marketing/lib/metadata";
import { getManagedLogos } from "@/server/services/site-content-service";

export const metadata = createMetadata(homePage);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const logos = buildClientLogos(await getManagedLogos());

  return (
    <MarketingShell headerVariant={homePage.headerVariant}>
      <Hero hero={homePage.hero} />
      <Services items={services} />
      <Logos items={logos} />
      <Benefits items={benefits} />
      <ContactStrip />
    </MarketingShell>
  );
}
