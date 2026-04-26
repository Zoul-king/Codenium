"use client";

import { readSession } from "@/features/auth/lib/session-store";
import { getRoleLabel } from "@/lib/utils/presenters";

export function SessionStatus() {
  const session = readSession();

  if (!session) {
    return <div className="rounded-[18px] border border-primary-500/15 bg-primary-50 px-4 py-3 text-sm text-primary-600">Aún no hay una sesión iniciada en este navegador.</div>;
  }

  return (
    <div className="rounded-[18px] border border-secondary-500/15 bg-secondary-500/10 px-4 py-3 text-sm">
      <p className="font-semibold text-body-color">{session.name}</p>
      <p className="mt-1 text-sm text-body-color">
        {session.email} · {getRoleLabel(session.role)}
      </p>
    </div>
  );
}
