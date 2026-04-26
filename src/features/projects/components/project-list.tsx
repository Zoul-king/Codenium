"use client";

import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { getUserById, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate, getProjectStatusLabel } from "@/lib/utils/presenters";
import type { Role } from "@/lib/types/domain";

interface ProjectListProps {
  role: Role;
}

export function ProjectList({ role }: ProjectListProps) {
  const { state } = useDashboardWorkspace();
  const items = getVisibleProjects(state, role);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <DashboardCard>
        <SectionHeading
          eyebrow={role === "admin" ? "Proyectos" : "Asignados"}
          title={role === "admin" ? "Operacion completa" : "Vista compacta de entrega"}
          description={role === "admin" ? "El admin ve todos los frentes activos y cerrados con responsable y origen." : "El PM solo ve proyectos asignados, sin duplicar workload ni resumenes."}
        />
        <div className="mt-6 grid gap-4">
          {items.map((project) => {
            const pm = getUserById(state, project.pmId);

            return (
              <div key={project.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{project.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                  </div>
                  <StatusBadge tone={project.status === "done" ? "success" : project.progress < 50 ? "warning" : "accent"}>{getProjectStatusLabel(project.status)}</StatusBadge>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Cliente</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{project.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">PM</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{pm?.name ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Entrega</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{formatLongDate(project.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Origen</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{project.quoteCode}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Lectura rapida" title="Prioridades operativas" />
        <div className="mt-6 grid gap-3">
          {items.map((project) => (
            <div key={project.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">{project.name}</p>
              <p className="mt-2 text-sm text-slate-600">{project.progress < 50 ? "Necesita seguimiento cercano." : project.status === "done" ? "Proyecto cerrado." : "Flujo estable con entrega en curso."}</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
