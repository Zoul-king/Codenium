import { AuthPanel } from "@/features/auth/components/auth-panel";
import { registerPage } from "@/features/auth/lib/auth-pages";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(registerPage);

export default function RegisterPage() {
  return (
    <MarketingShell headerVariant="white">
      <section className="section soft-section bg-foreground pt-[130px]">
        <div className="site-shell py-16 lg:py-20">
          <div className="mx-auto max-w-[640px]">
            <AuthPanel initialMode="register" />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
