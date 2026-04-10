"use client";

import { DashboardCard, DashboardMutedCard, MetricPill, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
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
    <div className="grid h-full gap-5 xl:grid-cols-[0.88fr_1.12fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Perfil" title={user?.name ?? "Sin usuario"} description={user?.title} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricPill label="Correo" value={user?.email ?? "-"} tone="accent" />
          <MetricPill label="Telefono" value={user?.phone ?? "-"} />
          <MetricPill label="Empresa" value={user?.company ?? "Interno"} />
          <MetricPill label="Estado" value={user?.state ?? "-"} />
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Relacion operativa" title={role === "client" ? "Tu punto de seguimiento" : "Relacion con cliente"} />
        <div className="mt-6 grid gap-4">
          {role === "client" ? (
            <>
              <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">PM asignado</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{pm?.name ?? "Pendiente"}</p>
                <p className="mt-2 text-sm text-slate-600">{pm?.email ?? "Se mostrara al confirmar el proyecto."}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Plan contratado</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{project?.planTitle ?? "Sin proyecto"}</p>
                <p className="mt-2 text-sm text-slate-600">{project?.planProfile === "business" ? "Perfil empresarial con lectura administrativa visible para el equipo." : "Perfil personal conectado a hitos, pagos y entregables."}</p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Cliente principal</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{client?.name ?? "Pendiente"}</p>
                <p className="mt-2 text-sm text-slate-600">{client?.email ?? "Sin contacto visible."}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Plan del proyecto</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{project?.planTitle ?? "Sin proyecto"}</p>
                <p className="mt-2 text-sm text-slate-600">Este dato tambien lo ve administracion y condiciona los pagos del cliente.</p>
              </div>
            </>
          )}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
