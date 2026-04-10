"use client";

import { DataRow, DashboardCard, ProgressBar, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "pm");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Pipeline" title="Tus proyectos" />

        <div className="mt-8 grid gap-6">
          {projects.map((project) => (
            <article key={project.id} className="dashboard-gridline grid gap-4 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.clientName}</p>
                </div>
                <p className="text-sm font-medium text-slate-500">{getProjectStatusLabel(project.status)}</p>
              </div>

              <p className="text-sm leading-7 text-slate-600">{project.summary}</p>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Avance</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>

                <div className="grid gap-2 text-sm text-slate-600 lg:text-right">
                  <p>{project.intakeSource === "service" ? "Servicio" : "Plan"}: {project.selectionLabel}</p>
                  <p>Entrega: {formatShortDate(project.dueDate)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Carga" title="Lectura operativa" />
        <div className="mt-6">
          <DataRow label="En proceso" value={String(activeProjects.length)} className="pt-0" />
          <DataRow label="Terminados" value={String(completedProjects.length)} />
          <DataRow label="Servicios activos" value={String(activeProjects.filter((project) => project.intakeSource === "service").length)} />
          <DataRow label="Planes activos" value={String(activeProjects.filter((project) => project.intakeSource === "plan").length)} className="border-b-0 pb-0" />
        </div>
      </DashboardCard>
    </div>
  );
}
