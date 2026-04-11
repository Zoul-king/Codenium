"use client";

import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryUser, getSelectedProject, getUserById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { Role } from "@/lib/types/domain";

interface ProfilePanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProfilePanel({ role }: ProfilePanelProps) {
  const { state } = useDashboardWorkspace();
  const user = getPrimaryUser(state, role);
  const project = getSelectedProject(state, role);
  const counterpart = getUserById(state, role === "client" ? project?.pmId : project?.clientId);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <DashboardCard>
        <SectionHeading title={user?.name ?? "Sin usuario"} description={user?.title} />
        <div className="mt-4 grid gap-3">
          <ProfileRow label="Correo" value={user?.email ?? "-"} />
          <ProfileRow label="Telefono" value={user?.phone ?? "-"} />
          <ProfileRow label="Empresa" value={user?.company ?? "Interno"} />
          <ProfileRow label="Estado" value={user?.state ?? "-"} />
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading title="Relacion operativa" />
        {project ? (
          <div className="mt-4 grid gap-3">
            <ProfileRow label="Proyecto activo" value={project.name} />
            <ProfileRow label={role === "client" ? "PM asignado" : "Cliente"} value={counterpart?.name ?? "Pendiente"} />
            <ProfileRow label={role === "client" ? "Correo PM" : "Correo cliente"} value={counterpart?.email ?? "-"} />
            <ProfileRow label="Origen" value={project.intakeSource === "service" ? "Servicio" : "Plan"} />
            <ProfileRow label="Seleccion" value={project.selectionLabel} />
          </div>
        ) : (
          <div className="mt-4">
            <DashboardEmptyState title="Sin proyecto seleccionado" body="Cuando elijas un proyecto desde la vista de proyectos, su contexto operativo se reflejara aqui." />
          </div>
        )}
      </DashboardMutedCard>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5 rounded-[16px] border border-slate-200 bg-white px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
