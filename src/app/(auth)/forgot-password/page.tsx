import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { forgotPasswordPage } from "@/features/auth/lib/auth-pages";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(forgotPasswordPage);

export default function ForgotPasswordPage() {
  return (
    <AuthShell page={forgotPasswordPage}>
      <AuthCard
        kicker="Recuperación"
        title="Solicita restablecer tu acceso"
        description="Comparte tu correo y te mostraremos el siguiente paso para volver a entrar a tu cuenta."
        footer={
          <div className="text-sm text-body-color">
            Volver a{" "}
            <Link href="/login" className="font-semibold hover:text-primary-500">
              iniciar sesión
            </Link>
          </div>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
