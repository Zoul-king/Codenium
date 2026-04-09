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
        description="La lógica es mock por ahora, pero la estructura ya está lista para integrarse con envío de correos y tokens reales."
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
