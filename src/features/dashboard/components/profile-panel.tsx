"use client";

import { getPrimaryProject, getPrimaryUser, getUserById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { Role } from "@/lib/types/domain";

interface ProfilePanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProfilePanel({ role }: ProfilePanelProps) {
  const { state } = useDashboardWorkspace();
  const user = getPrimaryUser(state, role);
  const project = getPrimaryProject(state, role);
  const pm = getUserById(state, project?.pmId);
  const client = getUserById(state, project?.clientId);

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[18px] border border-slate-200 bg-white px-6 py-6">
        <div className="border-b border-slate-200 pb-5">
          <p className="dashboard-eyebrow">Perfil</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950">{user?.name ?? "Sin usuario"}</h2>
          <p className="mt-2 text-sm text-slate-600">{user?.title}</p>
        </div>

        <div className="mt-6 grid gap-4">
          <ProfileRow label="Correo" value={user?.email ?? "-"} />
          <ProfileRow label="Telefono" value={user?.phone ?? "-"} />
          <ProfileRow label="Empresa" value={user?.company ?? "Interno"} />
          <ProfileRow label="Estado" value={user?.state ?? "-"} />
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.74)_0%,rgba(241,245,249,0.62)_100%)] px-6 py-6">
        <div className="border-b border-slate-200 pb-5">
          <p className="dashboard-eyebrow">{role === "client" ? "Seguimiento" : "Relacion operativa"}</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950">{role === "client" ? "Tu PM asignado y proyecto" : "Cliente principal y proyecto"}</h2>
        </div>

        <div className="mt-6 grid gap-4">
          {role === "client" ? (
            <>
              <ProfileRow label="PM asignado" value={pm?.name ?? "Pendiente"} />
              <ProfileRow label="Correo PM" value={pm?.email ?? "-"} />
              <ProfileRow label="Origen" value={project?.intakeSource === "service" ? "Servicio" : "Plan"} />
              <ProfileRow label="Seleccion contratada" value={project?.selectionLabel ?? "Sin proyecto"} />
            </>
          ) : (
            <>
              <ProfileRow label="Cliente principal" value={client?.name ?? "Pendiente"} />
              <ProfileRow label="Correo cliente" value={client?.email ?? "-"} />
              <ProfileRow label="Proyecto activo" value={project?.name ?? "Sin proyecto"} />
              <ProfileRow label="Origen" value={project?.intakeSource === "service" ? "Servicio" : "Plan"} />
              <ProfileRow label="Seleccion del proyecto" value={project?.selectionLabel ?? "Sin proyecto"} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 pb-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
