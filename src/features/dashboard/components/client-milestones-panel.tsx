"use client";

import { useState } from "react";

import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectChangeRequests, getProjectMilestones } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate } from "@/lib/presenters";

export function ClientMilestonesPanel() {
  const { state, addChangeRequest } = useDashboardWorkspace();
  const project = getPrimaryProject(state, "client");
  const milestones = getProjectMilestones(state, project?.id);
  const changes = getProjectChangeRequests(state, project?.id);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  if (!project) {
    return null;
  }

  const progress = milestones.length === 0 ? 0 : Math.round((milestones.filter((item) => item.status === "done").length / milestones.length) * 100);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Hitos del proyecto" title="Ruta de entregas y cambios" description="Cada hito conserva contexto y cada cambio queda conectado al proyecto actual." />
        <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Avance visible</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{progress}%</p>
          <div className="mt-4">
            <ProgressBar value={progress} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="grid grid-cols-[24px_minmax(0,1fr)] gap-4">
              <div className="flex flex-col items-center">
                <span className={`mt-1 h-3 w-3 rounded-full ${milestone.status === "done" ? "bg-emerald-500" : milestone.status === "current" ? "bg-primary-500" : "bg-amber-500"}`} />
                {index < milestones.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{milestone.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                  </div>
                  <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "warning"}>
                    {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Siguiente"}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Cambios solicitados" title="Solicitudes con contexto" description="El PM ve este mismo historial dentro de su panel y puede priorizarlo por proyecto." />
        <div className="mt-6 grid gap-3">
          {changes.map((change) => (
            <div key={change.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{change.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{change.detail}</p>
                </div>
                <StatusBadge tone={change.priority === "high" ? "danger" : change.priority === "medium" ? "warning" : "accent"}>{change.priority}</StatusBadge>
              </div>
            </div>
          ))}
        </div>

        <form
          className="mt-6 rounded-[22px] border border-slate-200 bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault();

            if (!title.trim() || !detail.trim()) {
              return;
            }

            addChangeRequest({
              projectId: project.id,
              clientId: project.clientId,
              title: title.trim(),
              detail: detail.trim(),
              priority
            });
            setTitle("");
            setDetail("");
          }}
        >
          <div className="grid gap-4">
            <TextField label="Titulo del cambio" placeholder="Ej. Ajustar orden del home comercial" value={title} onChange={setTitle} />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Prioridad
              <select value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")} className="dashboard-select">
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </label>
            <TextAreaField label="Descripcion" placeholder="Explica el cambio y el impacto esperado." rows={4} value={detail} onChange={setDetail} />
            <button type="submit" className="dashboard-button-primary w-fit">
              Registrar cambio
            </button>
          </div>
        </form>
      </DashboardMutedCard>
    </div>
  );
}
