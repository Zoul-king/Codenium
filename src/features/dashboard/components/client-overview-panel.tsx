"use client";

import Link from "next/link";

import { DataRow, DashboardCard, ProgressBar, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");

  if (projects.length === 0) {
    return (
      <DashboardCard className="max-w-3xl">
        <SectionHeading eyebrow="Resumen" title="Todavia no tienes proyectos activos" />
      </DashboardCard>
    );
  }

  const activeProject = projects[0];
  const completedProjects = projects.filter((project) => project.status === "done").length;

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.25fr)_340px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Resumen" title="Tus proyectos" />

        <div className="mt-8 grid gap-8">
          {projects.map((project) => (
            <article key={project.id} className="dashboard-gridline grid gap-5 pb-6 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{project.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
                </div>
                <div className="text-sm font-semibold text-slate-500">{getProjectStatusLabel(project.status)}</div>
              </div>

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
                  <p>Entrega estimada: {formatShortDate(project.dueDate)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Lectura rapida" title={activeProject.name} />
        <div className="mt-6">
          <DataRow label="Plan o servicio" value={activeProject.selectionLabel} className="pt-0" />
          <DataRow label="Origen" value={activeProject.intakeSource === "service" ? "Servicio" : "Plan"} />
          <DataRow label="Estado" value={getProjectStatusLabel(activeProject.status)} />
          <DataRow label="Proyectos cerrados" value={String(completedProjects)} />
          <DataRow label="Siguiente paso" value={<Link href="/dashboard/client/milestones" className="dashboard-link">Ir a hitos y cambios</Link>} className="border-b-0 pb-0" />
        </div>
      </DashboardCard>
    </div>
  );
}
