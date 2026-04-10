"use client";

import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "pm");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const completedProjects = projects.filter((project) => project.status === "done");

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1fr_1fr]">
      <ProjectColumn title="En proceso" items={activeProjects} />
      <ProjectColumn title="Terminados" items={completedProjects} />
    </div>
  );
}

function ProjectColumn({ title, items }: { title: string; items: ReturnType<typeof getVisibleProjects> }) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white/78 px-6 py-6">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="dashboard-eyebrow">Pipeline</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-500">{items.length}</span>
      </div>

      <div className="mt-6 grid gap-4">
        {items.map((project) => (
          <div key={project.id} className="grid gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">{project.clientName}</p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {getProjectStatusLabel(project.status)}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600">{project.summary}</p>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <p>Entrega: {formatShortDate(project.dueDate)}</p>
              <p>Avance: {project.progress}%</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
