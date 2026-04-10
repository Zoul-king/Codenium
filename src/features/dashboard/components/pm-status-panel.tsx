"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getProjectChangeRequests, getUpcomingMilestones, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate } from "@/lib/presenters";

export function PmStatusPanel() {
  const { state, completeMilestone } = useDashboardWorkspace();
  const milestones = getUpcomingMilestones(state, "pm");
  const projects = getVisibleProjects(state, "pm");
  const changes = projects.flatMap((project) => getProjectChangeRequests(state, project.id).map((change) => ({ ...change, projectName: project.name })));

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <DashboardCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Hitos" title="Ejecucion por proyecto" />
        </div>

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto">
          <div className="grid gap-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="grid gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{milestone.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{milestone.projectName}</p>
                  </div>
                  <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "neutral"}>
                    {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Pendiente"}
                  </StatusBadge>
                </div>
                <p className="text-sm leading-6 text-slate-600">{milestone.summary}</p>
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

      <DashboardMutedCard>
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Cambios solicitados" title="Solicitudes del cliente" />
        </div>

        <div className="mt-6 grid gap-4">
          {changes.map((change) => (
            <div key={change.id} className="grid gap-2 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{change.title}</p>
                <StatusBadge tone={change.priority === "high" ? "danger" : change.priority === "medium" ? "warning" : "accent"}>{change.priority}</StatusBadge>
              </div>
              <p className="text-sm text-slate-500">{change.projectName}</p>
              <p className="text-sm leading-6 text-slate-600">{change.detail}</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
