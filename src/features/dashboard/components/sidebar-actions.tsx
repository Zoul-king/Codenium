"use client";

import { useRouter } from "next/navigation";

import { clearSession } from "@/features/auth/lib/session-store";

export function SidebarActions() {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleLogout} className="dashboard-button-primary w-full justify-center">
        Cerrar sesion
      </button>
      <button type="button" onClick={() => router.push("/")} className="dashboard-button-secondary w-full justify-center">
        Volver al inicio
      </button>
    </div>
  );
}
