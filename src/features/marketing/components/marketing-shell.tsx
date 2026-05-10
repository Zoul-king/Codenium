import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageShell } from "@/features/marketing/components/page-shell";
import { WhatsAppButton } from "@/features/marketing/components/whatsapp-button";
import type { HeaderVariant } from "@/features/marketing/types";
import { getCurrentSession } from "@/lib/auth/session";
import { getPublicContactEmail } from "@/server/email/config";

interface MarketingShellProps {
  children: ReactNode;
  headerVariant: HeaderVariant;
  hideFooter?: boolean;
}

export async function MarketingShell({ children, headerVariant, hideFooter = false }: MarketingShellProps) {
  const contactEmail = getPublicContactEmail();
  const session = await getCurrentSession();

  return (
    <div className="page-shell">
      <Header variant={headerVariant} contactEmail={contactEmail} user={session?.user ?? null} />
      <PageShell>
        <main className="relative min-h-screen overflow-x-clip">{children}</main>
      </PageShell>
      {hideFooter ? null : <Footer contactEmail={contactEmail} />}
      <WhatsAppButton />
    </div>
  );
}
