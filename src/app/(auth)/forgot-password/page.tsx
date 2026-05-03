import Link from "next/link";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { forgotPasswordPage } from "@/features/auth/lib/auth-pages";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(forgotPasswordPage);

export default function ForgotPasswordPage() {
  return (
    <MarketingShell headerVariant="white">
      <section className="section soft-section flex min-h-[100dvh] items-center justify-center bg-surface-soft px-4 pt-28 pb-6 lg:pt-[130px] lg:pb-12">
        <div className="mx-auto w-full max-w-[640px] rounded-[20px] bg-white p-4 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:rounded-[24px] sm:p-8">
          <span className="type-kicker">Recuperar acceso</span>
          <h1 className="mt-3 text-[22px] font-bold leading-7 text-body-color sm:mt-4 sm:text-[28px] sm:leading-8">Vuelve a entrar a tu cuenta</h1>
          <p className="mt-2 text-sm leading-6 text-body-color sm:mt-3">Déjanos tu correo y te mostraremos el siguiente paso.</p>
          <div className="mt-4 sm:mt-6">
            <ForgotPasswordForm />
          </div>
          <div className="mt-4 text-sm text-body-color sm:mt-6">
            <Link href="/login" className="font-semibold transition-colors hover:text-primary-500">
              ← Volver al acceso
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
