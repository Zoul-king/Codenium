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
    <div className="grid h-full gap-5 xl:grid-cols-[0.88fr_1.12fr]">
      <DashboardMutedCard>
        <SectionHeading eyebrow="Hitos" title="Secuencia real por proyecto" description="Cuando un hito se cierra aqui, el pago asociado se activa automaticamente para el cliente." />
        <div className="mt-6 grid gap-3">
          {changes.map((change) => (
            <div key={change.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{change.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{change.projectName}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{change.detail}</p>
                </div>
                <StatusBadge tone={change.priority === "high" ? "danger" : change.priority === "medium" ? "warning" : "accent"}>{change.priority}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </DashboardMutedCard>

      <DashboardCard>
        <SectionHeading eyebrow="Ejecucion" title="Marcar hitos completados" />
        <div className="mt-6 grid gap-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">{milestone.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{milestone.projectName}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                  <p className="mt-3 text-sm font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
                </div>
                <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "warning"}>
                  {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Siguiente"}
                </StatusBadge>
              </div>
              {milestone.status !== "done" ? (
                <button type="button" className="dashboard-button-primary mt-5" onClick={() => completeMilestone(milestone.id)}>
                  Marcar como finalizado
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
