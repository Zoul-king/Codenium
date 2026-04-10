"use client";

import Link from "next/link";

import { DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { getProjectStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");

  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <DashboardCard className="max-w-2xl">
          <SectionHeading
            eyebrow="Proyectos"
            title="Todavia no tienes proyectos activos"
            description="Cuando una cotizacion pase a ejecucion, aqui veras nombre, avance y acceso directo a hitos y cambios."
          />
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6">
      <div className="border-b border-slate-200 pb-5">
        <SectionHeading eyebrow="Proyectos" title="Tus proyectos" description="Selecciona un proyecto para revisar hitos, cambios y seguimiento operativo." />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href="/dashboard/client/milestones"
            className="grid gap-4 rounded-[18px] border border-slate-200 bg-white px-5 py-5 transition hover:border-primary-200 hover:bg-primary-50/50"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{project.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {getProjectStatusLabel(project.status)}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-end">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Avance</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#224a78_0%,#3f7aa3_48%,#68b8b2_100%)]"
                    style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
                  />
                </div>
              </div>

              <div className="border-l border-slate-200 pl-4 text-sm text-slate-600 sm:text-right">
                <p className="font-semibold text-slate-900">{project.planTitle}</p>
                <p className="mt-2">Ir a hitos y cambios</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
