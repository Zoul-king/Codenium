import type { Metadata } from "next";

import { AuthPanel } from "@/features/auth/components/auth-panel";
import { loginPage } from "@/features/auth/lib/auth-pages";
import { createMetadata } from "@/features/marketing/lib/metadata";

export const metadata: Metadata = createMetadata(loginPage);

export default function LoginPage() {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[640px]">
        <AuthPanel mode="login" />
      </div>
      <p className="mt-8 text-center text-xs text-slate-500">
        © 2026 Techina. Todos los derechos reservados.
      </p>
    </section>
  );
}
