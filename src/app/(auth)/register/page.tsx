import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { registerPage } from "@/features/auth/lib/auth-pages";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(registerPage);

export default function RegisterPage() {
  return (
    <AuthShell page={registerPage}>
      <AuthCard
        kicker="Registro"
        title="Crear cuenta cliente"
        description="El registro público está pensado para clientes que quieren dar seguimiento a solicitudes, proyectos y mensajes desde un solo lugar."
        footer={
          <div className="text-sm text-body-color">
            ¿Ya tienes acceso?{" "}
            <Link href="/login" className="font-semibold hover:text-primary-500">
              Inicia sesión
            </Link>
          </div>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
