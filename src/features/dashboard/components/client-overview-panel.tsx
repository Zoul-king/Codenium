"use client";

import { DashboardCard, DashboardEmptyState, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getSelectedProject, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");
  const selectedProject = getSelectedProject(state, "client");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_320px]">
      <div className="grid gap-5">
        <DashboardCard>
          <SectionHeading title="Proyectos" description="Selecciona un proyecto para convertirlo en el contexto activo del resto del dashboard." />

          {activeProjects.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {activeProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => selectProject("client", project.id)}
                    className={`rounded-[20px] border px-4 py-4 text-left transition ${
                      isSelected ? "border-primary-300 bg-primary-50/70 shadow-[0_14px_24px_rgba(79,47,150,0.08)]" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-950">{project.name}</h3>
                          {isSelected ? <StatusBadge tone="accent">Seleccionado</StatusBadge> : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                      </div>
                      <div className="text-right text-xs font-medium text-slate-500">
                        <p>{getProjectStatusLabel(project.status)}</p>
                        <p className="mt-1">{formatShortDate(project.dueDate)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                        <span>Avance</span>
                        <span>{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-5">
              <DashboardEmptyState title="No hay proyectos activos" body="Cuando una cotizacion se convierta en proyecto, podras seleccionarla desde aqui." />
            </div>
          )}
        </DashboardCard>

        {completedProjects.length > 0 ? (
          <DashboardMutedCard>
            <SectionHeading title="Terminados" description="Se mantienen visibles con menor protagonismo para consulta rapida." />
            <div className="mt-4 grid gap-3">
              {completedProjects.map((project) => (
                <article key={project.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{project.selectionLabel}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{getProjectStatusLabel(project.status)}</p>
                      <p>{formatShortDate(project.dueDate)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </DashboardMutedCard>
        ) : null}
      </div>

      <DashboardCard className="h-fit xl:sticky xl:top-4">
        <SectionHeading title={selectedProject ? "Proyecto activo" : "Sin contexto"} />
        {selectedProject ? (
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Seleccion actual</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{selectedProject.name}</p>
              <p className="mt-2 text-sm text-slate-600">{selectedProject.selectionLabel}</p>
            </div>
            <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Estado</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{getProjectStatusLabel(selectedProject.status)}</p>
              <p className="mt-2 text-sm text-slate-600">Entrega estimada {formatShortDate(selectedProject.dueDate)}</p>
            </div>
            <p className="text-sm leading-6 text-slate-600">Hitos, cambios, pagos, entregables y chat usan este proyecto como referencia hasta que selecciones otro desde esta vista.</p>
          </div>
        ) : (
          <div className="mt-4">
            <DashboardEmptyState title="Selecciona un proyecto" body="El resto de las secciones se activara cuando elijas un proyecto desde la lista principal." />
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
