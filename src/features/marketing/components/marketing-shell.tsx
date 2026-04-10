import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageShell } from "@/features/marketing/components/page-shell";
import { WhatsAppButton } from "@/features/marketing/components/whatsapp-button";
import type { HeaderVariant } from "@/features/marketing/types";
import { getPublicContactEmail } from "@/server/email/config";

interface MarketingShellProps {
  children: ReactNode;
  headerVariant: HeaderVariant;
}

export function MarketingShell({ children, headerVariant }: MarketingShellProps) {
  const contactEmail = getPublicContactEmail();

  return (
    <div className="page-shell">
      <Header variant={headerVariant} contactEmail={contactEmail} />
      <PageShell>
        <main className="relative min-h-screen overflow-x-hidden">{children}</main>
      </PageShell>
      <Footer contactEmail={contactEmail} />
      <WhatsAppButton contactEmail={contactEmail} />
    </div>
  );
}
