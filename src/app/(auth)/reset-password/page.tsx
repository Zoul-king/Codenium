import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { resetPasswordPage } from "@/features/auth/lib/auth-pages";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata: Metadata = createMetadata(resetPasswordPage);

export default function ResetPasswordPage() {
  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[640px] rounded-[20px] bg-white p-4 shadow-[0_16px_40px_rgba(14,20,36,0.08)] sm:rounded-[24px] sm:p-8">
        <span className="type-kicker">Restablecer contraseña</span>
        <h1 className="mt-3 text-[22px] font-bold leading-7 text-body-color sm:mt-4 sm:text-[28px] sm:leading-8">
          Define una nueva contraseña
        </h1>
        <p className="mt-2 text-sm leading-6 text-body-color sm:mt-3">
          Ingresa la nueva contraseña que usarás para iniciar sesión. Cerraremos tus sesiones
          activas para mayor seguridad.
        </p>
        <div className="mt-4 sm:mt-6">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
        <div className="mt-4 text-sm text-body-color sm:mt-6">
          <Link href="/login" className="font-semibold transition-colors hover:text-primary-500">
            ← Volver al acceso
          </Link>
        </div>
      </div>
    </section>
  );
}
