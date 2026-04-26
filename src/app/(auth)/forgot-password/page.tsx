import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { forgotPasswordPage } from "@/features/auth/lib/auth-pages";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(forgotPasswordPage);

export default function ForgotPasswordPage() {
  return (
    <MarketingShell headerVariant="white">
      <section className="section soft-section bg-surface-soft pt-[130px]">
        <div className="site-shell py-16 lg:py-20">
          <div className="mx-auto max-w-[640px] rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:p-8">
            <span className="type-kicker">Recuperar acceso</span>
            <h1 className="mt-4 text-[28px] font-bold leading-8 text-body-color">Vuelve a entrar a tu cuenta</h1>
            <p className="mt-3 text-sm leading-6 text-body-color">Déjanos tu correo y te mostraremos el siguiente paso.</p>
            <div className="mt-6">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
