import type { Metadata } from "next";

import { validateLicense } from "@/lib/license";
import { system } from "@/config/system";

export const metadata: Metadata = {
  title: "Licencia expirada",
  description: "Esta instancia no tiene una licencia válida."
};

export const dynamic = "force-dynamic";

export default function LicenseExpiredPage() {
  const status = validateLicense();

  const message =
    status.reason === "expired"
      ? "La licencia de esta instalación ha expirado."
      : status.reason === "missing_key"
        ? "No se ha configurado una clave de licencia para esta instalación."
        : status.reason === "missing_expiration" || status.reason === "invalid_expiration"
          ? "La fecha de expiración de la licencia no es válida."
          : "La licencia de esta instalación no es válida.";

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {system.systemName}
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Licencia expirada</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Contacta a los autores para obtener una licencia válida. No se ha eliminado ni modificado
          información del sistema.
        </p>
        <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {system.copyright}
        </div>
      </div>
    </main>
  );
}
