"use client";

import { useMemo, useState } from "react";

import { TextAreaField, TextField } from "@/components/common/form-field";
import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { resolvePaymentMilestoneState } from "@/features/dashboard/components/shared/payments-panel";
import { getMilestonePayment, getProjectChangeRequests, getProjectMilestones, getSelectedProject, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate } from "@/lib/utils/presenters";

export function PmStatusPanel() {
  const { state, completeMilestone, saveMilestone } = useDashboardWorkspace();
  const project = getSelectedProject(state, "pm");
  const projects = getVisibleProjects(state, "pm");
  const milestones = getProjectMilestones(state, project?.id);
  const changes = getProjectChangeRequests(state, project?.id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingMilestone = useMemo(() => milestones.find((item) => item.id === editingId), [editingId, milestones]);
  const [form, setForm] = useState({
    projectId: project?.id ?? "",
    title: "",
    summary: "",
    date: "",
    status: "next" as "done" | "current" | "next"
  });

  if (!project) {
    return (
      <DashboardCard>
        <DashboardEmptyState title="Selecciona un proyecto" body="La gestion de hitos depende del proyecto activo que elijas en la seccion Proyectos." />
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_340px]">
      <DashboardCard>
        <SectionHeading title="Hitos del proyecto" description="Puedes crear, editar y completar hitos del proyecto seleccionado. Los pagos reflejan el estado de cada hito." />

        <div className="mt-5 grid gap-3">
          {milestones.length > 0 ? (
            milestones.map((milestone) => {
              const payment = getMilestonePayment(state, milestone.id);
              const paymentState = resolvePaymentMilestoneState(milestone.status, payment?.status);

              return (
                <article key={milestone.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950">{milestone.title}</p>
                        <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "neutral"}>
                          {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En proceso" : "Pendiente"}
                        </StatusBadge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{formatLongDate(milestone.date)}</p>
                      <p className="mt-2">{paymentState.label}</p>
                    </div>
                  </div>

                  {payment ? (
                    <p className="mt-3 text-sm text-slate-600">
                      {payment.label} · {formatCurrency(payment.amount)}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {milestone.status !== "done" ? (
                      <button type="button" className="dashboard-button-primary" onClick={() => completeMilestone(milestone.id)}>
                        Marcar finalizado
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="dashboard-button-secondary"
                      onClick={() => {
                        setEditingId(milestone.id);
                        setForm({
                          projectId: milestone.projectId,
                          title: milestone.title,
                          summary: milestone.summary,
                          date: milestone.date,
                          status: milestone.status
                        });
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <DashboardEmptyState title="Sin hitos" body="Crea el primer hito del proyecto para empezar a coordinar avance y pagos." />
          )}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <SectionHeading title="Cambios del cliente" />
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
                </article>
              ))
            ) : (
              <DashboardEmptyState title="Sin cambios pendientes" body="Los cambios que el cliente solicite para este proyecto apareceran aqui." />
            )}
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
        <SectionHeading title={editingMilestone ? "Editar hito" : "Nuevo hito"} />

        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();

            if (!form.projectId || !form.title.trim() || !form.summary.trim() || !form.date) {
              return;
            }

            saveMilestone({
              id: editingId ?? undefined,
              projectId: form.projectId,
              title: form.title.trim(),
              summary: form.summary.trim(),
              date: form.date,
              status: form.status
            });

            setEditingId(null);
            setForm({
              projectId: project.id,
              title: "",
              summary: "",
              date: "",
              status: "next"
            });
          }}
        >
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Proyecto
            <select value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} className="dashboard-select">
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <TextField label="Titulo" placeholder="Ej. Validacion de sprint" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
          <TextAreaField label="Descripcion" placeholder="Describe el objetivo del hito." rows={4} value={form.summary} onChange={(value) => setForm((current) => ({ ...current, summary: value }))} />
          <TextField label="Fecha" placeholder="Fecha del hito" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Estado
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "done" | "current" | "next" }))} className="dashboard-select">
              <option value="next">Pendiente</option>
              <option value="current">En proceso</option>
              <option value="done">Completado</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button type="submit" className="dashboard-button-primary flex-1 justify-center">
              {editingMilestone ? "Guardar cambios" : "Crear hito"}
            </button>
            {editingMilestone ? (
              <button
                type="button"
                className="dashboard-button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    projectId: project.id,
                    title: "",
                    summary: "",
                    date: "",
                    status: "next"
                  });
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </DashboardMutedCard>
    </div>
  );
}
