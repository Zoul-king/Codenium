import { Cta } from "@/features/marketing/components/cta";
import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { Story } from "@/features/marketing/components/story";
import { Timeline } from "@/features/marketing/components/timeline";
import { aboutPage, missionVision, story, timeline } from "@/features/marketing/data/about";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(aboutPage);

export default function AboutPage() {
  return (
    <MarketingShell headerVariant={aboutPage.headerVariant}>
      <Hero hero={aboutPage.hero} />
      <Story paragraphs={story} missionVision={missionVision} />
      <Timeline steps={timeline} />
      <Cta dual />
    </MarketingShell>
  );
}
