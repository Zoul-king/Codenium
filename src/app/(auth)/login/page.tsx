import { AuthPanel } from "@/features/auth/components/auth-panel";
import { loginPage } from "@/features/auth/lib/auth-pages";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(loginPage);

export default function LoginPage() {
  return (
    <MarketingShell headerVariant="white">
      <section className="section soft-section flex min-h-[100dvh] items-center justify-center bg-surface-soft px-4 pt-28 pb-6 lg:pt-[130px] lg:pb-12">
        <div className="mx-auto w-full max-w-[640px]">
          <AuthPanel mode="login" />
        </div>
      </section>
    </MarketingShell>
  );
}
