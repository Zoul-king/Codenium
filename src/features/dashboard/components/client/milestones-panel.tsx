"use client";

import { useMemo, useState } from "react";

import { TextAreaField, TextField } from "@/components/common/form-field";
import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { getProjectPmEmail } from "@/features/dashboard/lib/recipients";
import { getProjectChangeRequests, getProjectMilestones, getSelectedProject } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import { formatLongDate } from "@/lib/utils/presenters";

export function ClientMilestonesPanel() {
  const { state, addChangeRequest } = useDashboardWorkspace();
  const project = getSelectedProject(state, "client");
  const milestones = getProjectMilestones(state, project?.id);
  const changes = getProjectChangeRequests(state, project?.id);
  const [milestoneId, setMilestoneId] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [notice, setNotice] = useState("");

  const selectedMilestone = useMemo(() => milestones.find((item) => item.id === milestoneId), [milestoneId, milestones]);

  if (!project) {
    return (
      <DashboardCard>
        <DashboardEmptyState title="Selecciona un proyecto" body="Para ver hitos y solicitar cambios, primero elige un proyecto en la seccion Proyectos." />
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_340px]">
      <DashboardCard>
        <SectionHeading title={project.name} description="Los hitos y cambios mostrados aqui pertenecen al proyecto seleccionado." />

        <div className="mt-5 grid gap-3">
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <article key={milestone.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{milestone.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                  </div>
                  <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "neutral"}>
                    {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En proceso" : "Pendiente"}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
              </article>
            ))
          ) : (
            <DashboardEmptyState title="Sin hitos registrados" body="Este proyecto todavia no tiene hitos visibles." />
          )}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <SectionHeading title="Cambios enviados" />
          <div className="mt-4 grid gap-3">
            {changes.length > 0 ? (
              changes.map((change) => (
                <article key={change.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{change.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{change.detail}</p>
                    </div>
                    <StatusBadge tone={change.priority === "high" ? "danger" : change.priority === "medium" ? "warning" : "accent"}>{change.priority}</StatusBadge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    {change.milestoneId ? <span>Relacionado a hito</span> : <span>Relacionado al proyecto</span>}
                    <span>{change.status}</span>
                  </div>
                </article>
              ))
            ) : (
              <DashboardEmptyState title="Sin cambios registrados" body="Cuando solicites un ajuste, aparecerá aqui y tambien quedará visible para el PM." />
            )}
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
        <SectionHeading title="Solicitar cambio" description="Puedes relacionarlo al proyecto general o a un hito especifico." />

        <form
          className="mt-4 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!title.trim() || !detail.trim()) {
              return;
            }

            const nextTitle = title.trim();
            const nextDetail = detail.trim();
            const composedDetail = selectedMilestone ? `${nextDetail}\n\nHito relacionado: ${selectedMilestone.title}` : nextDetail;

            addChangeRequest({
              projectId: project.id,
              clientId: project.clientId,
              milestoneId: selectedMilestone?.id,
              title: nextTitle,
              detail: composedDetail,
              priority
            });

            setTitle("");
            setDetail("");
            setMilestoneId("");

            try {
              const recipientEmail = getProjectPmEmail(state, project.id);
              const pmName = state.users.find((user) => user.id === project.pmId)?.name ?? "PM asignado";

              if (!recipientEmail) {
                throw new Error("No encontramos el correo del PM asignado.");
              }

              await sendDashboardNotification({
                type: "change_request",
                recipientEmail,
                recipientName: pmName,
                requestedBy: project.clientName,
                projectName: project.name,
                title: nextTitle,
                detail: composedDetail,
                priority
              });

              setNotice("");
            } catch (error) {
              setNotice(error instanceof Error ? error.message : "No pudimos enviar la notificacion del cambio.");
            }
          }}
        >
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Relacionado a
            <select value={milestoneId} onChange={(event) => setMilestoneId(event.target.value)} className="dashboard-select">
              <option value="">Proyecto completo</option>
              {milestones.map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title}
                </option>
              ))}
            </select>
          </label>
          <TextField label="Titulo" placeholder="Ej. Ajustar prioridad del bloque comercial" value={title} onChange={setTitle} />
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Prioridad
            <select value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")} className="dashboard-select">
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </label>
          <TextAreaField label="Descripcion" placeholder="Describe el cambio y el motivo." rows={4} value={detail} onChange={setDetail} />
          {notice ? <p className="text-sm font-medium text-rose-600">{notice}</p> : null}
          <button type="submit" className="dashboard-button-primary w-full justify-center">
            Enviar cambio
          </button>
        </form>
      </DashboardMutedCard>
    </div>
  );
}
