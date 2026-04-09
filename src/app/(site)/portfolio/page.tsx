import { SitePage } from "@/features/site/components/site-page";
import { sitePages } from "@/features/site/content/site-pages";
import { createPageMetadata } from "@/features/site/lib/metadata";

export const metadata = createPageMetadata(sitePages.portfolio);

export default function PortfolioPage() {
  return <SitePage page={sitePages.portfolio} />;
}
