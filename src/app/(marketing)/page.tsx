import { Benefits } from "@/features/marketing/components/benefits";
import { ContactStrip } from "@/features/marketing/components/contact-form";
import { Hero } from "@/features/marketing/components/hero";
import { Logos } from "@/features/marketing/components/logos";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { Services } from "@/features/marketing/components/services";
import { benefits, clientLogos, homePage, services } from "@/features/marketing/data/home";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(homePage);

export default function HomePage() {
  return (
    <MarketingShell headerVariant={homePage.headerVariant}>
      <Hero hero={homePage.hero} />
      <Services items={services} />
      <Logos items={clientLogos} />
      <Benefits items={benefits} />
      <ContactStrip />
    </MarketingShell>
  );
}
