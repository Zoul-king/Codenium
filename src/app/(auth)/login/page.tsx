import { AuthPanel } from "@/features/auth/components/auth-panel";
import { loginPage } from "@/features/auth/lib/auth-pages";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(loginPage);

export default function LoginPage() {
  return (
    <MarketingShell headerVariant="white">
      <section className="section soft-section bg-surface-soft pt-[130px]">
        <div className="site-shell py-16 lg:py-20">
          <div className="mx-auto max-w-[640px]">
            <AuthPanel initialMode="login" showSessionStatus />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
