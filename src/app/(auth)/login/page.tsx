import { AuthCard, AuthFooterLinks } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import { SessionStatus } from "@/features/auth/components/session-status";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { loginPage } from "@/features/auth/lib/auth-pages";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata = createMetadata(loginPage);

export default function LoginPage() {
  return (
    <AuthShell page={loginPage}>
      <AuthCard
        kicker="Acceso"
        title="Entra a tu espacio de trabajo"
        description="Este flujo usa sesión mock y queda listo para conectarse con Auth.js o el proveedor real que definamos después."
        footer={<AuthFooterLinks />}
      >
        <LoginForm />
        <div className="mt-6">
          <SessionStatus />
        </div>
      </AuthCard>
    </AuthShell>
  );
}
