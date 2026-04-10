"use client";

import { DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getProjectChangeRequests, getUpcomingMilestones, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate } from "@/lib/presenters";

export function PmStatusPanel() {
  const { state, completeMilestone } = useDashboardWorkspace();
  const milestones = getUpcomingMilestones(state, "pm");
  const projects = getVisibleProjects(state, "pm");
  const changes = projects.flatMap((project) => getProjectChangeRequests(state, project.id).map((change) => ({ ...change, projectName: project.name })));

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.04fr)_360px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Hitos" title="Ejecucion por proyecto" />

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto">
          <div className="grid gap-5">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="dashboard-gridline grid gap-3 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{milestone.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{milestone.projectName}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Pendiente"}
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-600">{milestone.summary}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
                  {milestone.status !== "done" ? (
                    <button type="button" className="dashboard-button-primary" onClick={() => completeMilestone(milestone.id)}>
                      Marcar finalizado
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Cambios" title="Solicitudes activas" />

        <div className="mt-6 grid gap-4">
          {changes.map((change) => (
            <div key={change.id} className="dashboard-gridline grid gap-2 pb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-slate-950">{change.title}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{change.priority}</p>
              </div>
              <p className="text-sm text-slate-500">{change.projectName}</p>
              <p className="text-sm leading-6 text-slate-600">{change.detail}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
