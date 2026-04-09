import { SitePage } from "@/features/site/components/site-page";
import { sitePages } from "@/features/site/content/site-pages";

export default function HomePage() {
  return <SitePage page={sitePages.home} />;
}
