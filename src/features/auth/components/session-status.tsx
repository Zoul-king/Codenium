"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearSession, readSession } from "@/features/auth/lib/session-store";
import { dashboardHomeByRole } from "@/lib/mocks";
import type { MockSession } from "@/lib/types/domain";

export function SessionStatus() {
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  if (!session) {
    return (
      <div className="rounded-[18px] bg-foreground p-4">
        <p className="text-sm text-body-color">Sin sesión mock activa.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-foreground p-4">
      <p className="text-sm font-semibold text-primary-500">Sesión mock activa</p>
      <p className="mt-2 text-sm text-body-color">
        {session.name} · {session.role}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <Link href={dashboardHomeByRole[session.role]} className="hover:text-primary-500">
          Ir al dashboard
        </Link>
        <button
          type="button"
          className="cursor-pointer text-body-color hover:text-primary-500"
          onClick={() => {
            clearSession();
            setSession(null);
          }}
        >
          Cerrar sesión mock
        </button>
      </div>
    </div>
  );
}
