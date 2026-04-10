"use client";

import { DashboardCard, DashboardEmptyState, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getSelectedProject, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "pm");
  const selectedProject = getSelectedProject(state, "pm");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_320px]">
      <div className="grid gap-5">
        <DashboardCard>
          <SectionHeading title="Proyectos" description="Selecciona un proyecto para que hitos, entregables, chat y perfil se actualicen con ese contexto." />

          {activeProjects.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {activeProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => selectProject("pm", project.id)}
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
                        <p className="mt-1 text-sm text-slate-500">{project.clientName}</p>
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
              <DashboardEmptyState title="No hay proyectos activos" body="Cuando se te asigne un proyecto, podras activarlo desde esta vista." />
            </div>
          )}
        </DashboardCard>

        {completedProjects.length > 0 ? (
          <DashboardMutedCard>
            <SectionHeading title="Terminados" description="Se compactan para no estorbar la operacion activa." />
            <div className="mt-4 grid gap-3">
              {completedProjects.map((project) => (
                <article key={project.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{project.clientName}</p>
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
        <SectionHeading title={selectedProject ? "Contexto actual" : "Sin contexto"} />
        {selectedProject ? (
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Proyecto</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{selectedProject.name}</p>
              <p className="mt-2 text-sm text-slate-600">{selectedProject.clientName}</p>
            </div>
            <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Entrega</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{formatShortDate(selectedProject.dueDate)}</p>
              <p className="mt-2 text-sm text-slate-600">{selectedProject.selectionLabel}</p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <DashboardEmptyState title="Selecciona un proyecto" body="El contexto de hitos, entregables, pagos y chat se define desde la vista de proyectos." />
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
