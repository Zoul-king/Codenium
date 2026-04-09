import { SitePage } from "@/features/site/components/site-page";
import { sitePages } from "@/features/site/content/site-pages";
import { createPageMetadata } from "@/features/site/lib/metadata";

export const metadata = createPageMetadata(sitePages.privacy);

export default function LegalPrivacyPage() {
  return <SitePage page={sitePages.privacy} />;
}
