"use client";

import { Calendar, CheckCircle2, Folder, FolderOpen, MessageCircle } from "lucide-react";

import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getProjectMessages,
  getProjectMilestones,
  getProjectPayments,
  getSelectedOrPrimaryProject,
  getUserById,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

export function ClientOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");
  const selectedProject = getSelectedOrPrimaryProject(state, "client");

  if (projects.length === 0) {
    return (
      <DashboardEmptyState
        title="Aún no tienes proyectos"
        body="En cuanto aceptemos una de tus cotizaciones aparecerá aquí. Selecciónalo para ver hitos, pagos y entregables."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const isSelected = selectedProject?.id === project.id;
          const milestones = getProjectMilestones(state, project.id);
          const doneCount = milestones.filter((m) => m.status === "done").length;
          const payments = getProjectPayments(state, project.id);
          const pendingPayments = payments.filter((p) => p.status !== "paid").length;
          const messages = getProjectMessages(state, project.id);
          const unread = messages.filter((m) => m.status === "unread" && m.role !== "client").length;
          const pm = getUserById(state, project.pmId);

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => selectProject("client", project.id)}
              className={cn(
                "group flex flex-col gap-4 rounded-[var(--radius-card-dense)] border bg-white p-5 text-left shadow-[var(--shadow-card-dense)] transition",
                isSelected
                  ? "border-[var(--role-strong,#224a78)] ring-2 ring-[var(--role,#5e92c2)]/30"
                  : "border-slate-200 hover:border-[var(--role,#5e92c2)]/40 hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-[14px]",
                    isSelected
                      ? "bg-[var(--role-strong,#224a78)] text-white"
                      : "bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]"
                  )}
                >
                  {isSelected ? <FolderOpen className="size-5" /> : <Folder className="size-5" />}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold leading-tight text-slate-950">{project.name}</h2>
                  <p className="mt-1 text-[11px] text-slate-500">{project.quoteCode}</p>
                </div>
              </div>

              <ul className="grid gap-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-slate-400" />
                  Entrega aproximada: {formatLongDate(project.dueDate)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-slate-400" />
                  {doneCount} de {milestones.length} hitos · {pendingPayments} pagos pendientes
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="size-3.5 text-slate-400" />
                  PM: {pm?.name ?? "Sin asignar"}
                  {unread > 0 ? (
                    <span className="ml-1 rounded-full bg-error-50 px-1.5 py-0.5 text-[10px] font-semibold text-error-700">
                      {unread} sin leer
                    </span>
                  ) : null}
                </li>
              </ul>

              <span
                className={cn(
                  "mt-auto inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold transition",
                  isSelected
                    ? "bg-[var(--role-strong,#224a78)] text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-[var(--role-soft,#eff6fb)] group-hover:text-[var(--role-strong,#224a78)]"
                )}
              >
                {isSelected ? "Seleccionado" : "Seleccionar"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
