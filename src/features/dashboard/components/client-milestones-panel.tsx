"use client";

import { useState } from "react";

import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
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

  const completedCount = milestones.filter((item) => item.status === "done").length;
  const currentMilestone = milestones.find((item) => item.status === "current");

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <DashboardCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading
            eyebrow="Hitos y cambios"
            title={project.name}
            description={`Avance por partes: ${completedCount} de ${milestones.length} hitos completados.`}
          />
        </div>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start">
            <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Hito actual</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">{currentMilestone?.title ?? "Sin hito activo"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{currentMilestone?.summary ?? "No hay una etapa activa en este momento."}</p>
            </div>

            <div className="grid gap-3">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="grid grid-cols-[34px_minmax(0,1fr)] gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 grid size-8 place-content-center rounded-full text-xs font-semibold ${
                        milestone.status === "done" ? "bg-emerald-100 text-emerald-700" : milestone.status === "current" ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < milestones.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
                  </div>
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-950">{milestone.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                      </div>
                      <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "neutral"}>
                        {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Pendiente"}
                      </StatusBadge>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Cambios ya solicitados</p>
            {changes.length > 0 ? (
              changes.map((change) => (
                <div key={change.id} className="grid gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{change.title}</p>
                    <StatusBadge tone={change.priority === "high" ? "danger" : change.priority === "medium" ? "warning" : "accent"}>{change.priority}</StatusBadge>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{change.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Todavia no hay cambios registrados para este proyecto.</p>
            )}
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Solicitar cambio" title="Registrar ajuste para el PM" description="La solicitud se guarda en la sesion actual y aparece en el panel del PM para este mismo proyecto." />
        </div>

        <form
          className="mt-6 grid gap-4"
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
          <TextField label="Titulo del cambio" placeholder="Ej. Ajustar orden del home comercial" value={title} onChange={setTitle} />
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Prioridad
            <select value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")} className="dashboard-select">
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </label>
          <TextAreaField label="Descripcion" placeholder="Explica el cambio y el impacto esperado." rows={6} value={detail} onChange={setDetail} />
          <button type="submit" className="dashboard-button-primary w-fit">
            Enviar solicitud
          </button>
        </form>
      </DashboardMutedCard>
    </div>
  );
}
