"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearSession, readSession } from "@/features/auth/lib/session-store";
import { dashboardHomeByRole } from "@/lib/mocks";
import { getRoleLabel } from "@/lib/presenters";
import type { MockSession } from "@/lib/types/domain";

export function SessionStatus() {
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  if (!session) {
    return (
      <div className="rounded-[18px] bg-foreground p-4">
        <p className="text-sm text-body-color">Todavía no has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-foreground p-4">
      <p className="text-sm font-semibold text-primary-500">Ya tienes una sesión activa</p>
      <p className="mt-2 text-sm text-body-color">
        {session.name} · {getRoleLabel(session.role)}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <Link href={dashboardHomeByRole[session.role]} className="hover:text-primary-500">
          Ir a mi panel
        </Link>
        <button
          type="button"
          className="cursor-pointer text-body-color hover:text-primary-500"
          onClick={() => {
            clearSession();
            setSession(null);
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
