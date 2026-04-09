import type { ReactNode } from "react";

import { Hero } from "@/features/marketing/components/hero";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import type { MarketingPageData } from "@/features/marketing/types";

interface AuthShellProps {
  page: MarketingPageData;
  children: ReactNode;
}

export function AuthShell({ page, children }: AuthShellProps) {
  return (
    <MarketingShell headerVariant={page.headerVariant}>
      <Hero hero={page.hero} />
      <section className="section soft-section bg-foreground">
        <div className="site-shell py-16 lg:py-20">{children}</div>
      </section>
    </MarketingShell>
  );
}
