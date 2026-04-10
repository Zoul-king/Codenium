"use client";

import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPendingMessages, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "pm");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");
  const pendingMessages = getPendingMessages(state, "pm");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Proyectos" title="Frentes en proceso y terminados" description="El PM ve separados los proyectos activos y los ya cerrados para priorizar seguimiento real." />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ProjectColumn title="En proceso" items={activeProjects} />
          <ProjectColumn title="Terminados" items={completedProjects} />
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Seguimiento" title={`${pendingMessages.length} mensajes pendientes`} />
        <div className="mt-6 grid gap-3">
          {pendingMessages.map((message) => (
            <div key={message.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">{message.senderName}</p>
              <p className="mt-1 text-sm text-slate-500">{message.thread}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message.preview}</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}

function ProjectColumn({ title, items }: { title: string; items: ReturnType<typeof getVisibleProjects> }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <span className="text-sm font-semibold text-slate-500">{items.length}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((project) => (
          <div key={project.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">{project.clientName}</p>
              </div>
              <StatusBadge tone={project.status === "done" ? "success" : "accent"}>{getProjectStatusLabel(project.status)}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>Entrega</span>
                <span>{formatShortDate(project.dueDate)}</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
