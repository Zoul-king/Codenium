"use client";

import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "pm");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");
  const closestDue = activeProjects
    .slice()
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
      <div className="grid gap-6">
        <DashboardCard>
          <SectionHeading eyebrow="Operacion" title="Pipeline de proyectos" description="Una vista compacta para priorizar seguimiento, avance y proximos vencimientos." />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryMetric label="Activos" value={String(activeProjects.length)} helper="Frentes en curso" />
            <SummaryMetric label="Cerrados" value={String(completedProjects.length)} helper="Historial entregado" />
            <SummaryMetric label="Mas cercano" value={closestDue ? formatShortDate(closestDue.dueDate) : "-"} helper={closestDue?.name ?? "Sin entregas inmediatas"} />
          </div>
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Carga operativa" title="Proyectos a tu cargo" />
          <div className="mt-6 grid gap-4">
            {projects.map((project) => (
              <article key={project.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{project.name}</h3>
                      <StatusBadge tone={project.status === "done" ? "success" : project.progress >= 70 ? "accent" : "neutral"}>{getProjectStatusLabel(project.status)}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-500">{project.clientName}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Entrega</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{formatShortDate(project.dueDate)}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>Avance</span>
                      <span>{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 lg:text-right">
                    <p>{project.intakeSource === "service" ? "Servicio" : "Plan"}: {project.selectionLabel}</p>
                    <p>Codigo: {project.quoteCode}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </DashboardMutedCard>
      </div>

      <div className="grid h-fit gap-6 xl:sticky xl:top-6">
        <DashboardCard>
          <SectionHeading eyebrow="Prioridad" title="Foco de hoy" />
          <div className="mt-6 grid gap-4">
            {activeProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">{project.name}</p>
                <p className="mt-2 text-sm text-slate-600">{project.clientName}</p>
                <p className="mt-3 text-sm text-slate-500">Entrega {formatShortDate(project.dueDate)}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Flujo" title="Siguiente revision" />
          <p className="mt-4 text-sm leading-7 text-slate-600">Desde aqui el flujo ideal es revisar hitos, luego entregables y finalmente conversaciones abiertas con cliente.</p>
        </DashboardMutedCard>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}
