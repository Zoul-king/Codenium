"use client";

import { useState } from "react";

import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getProjectPmEmail } from "@/features/dashboard/lib/recipients";
import { getPrimaryProject } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/client-api";

export function ChangeRequestPanel() {
  const { state, addChangeRequest } = useDashboardWorkspace();
  const project = getPrimaryProject(state, "client");
  const [changeType, setChangeType] = useState("alcance");
  const [priority, setPriority] = useState("media");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project || !title.trim() || !detail.trim()) {
      return;
    }

    const normalizedPriority = priority === "alta" ? "high" : priority === "baja" ? "low" : "medium";
    const nextTitle = title.trim();
    const nextDetail = `${detail.trim()}\n\nTipo de cambio: ${changeType}`;

    addChangeRequest({
      projectId: project.id,
      clientId: project.clientId,
      title: nextTitle,
      detail: nextDetail,
      priority: normalizedPriority
    });

    setSubmitted(true);
    setTitle("");
    setDetail("");

    try {
      const recipientEmail = getProjectPmEmail(state, project.id);
      const recipientName = state.users.find((user) => user.id === project.pmId)?.name ?? "PM asignado";

      if (!recipientEmail) {
        throw new Error("No encontramos el correo del PM para esta solicitud.");
      }

      await sendDashboardNotification({
        type: "change_request",
        recipientEmail,
        recipientName,
        requestedBy: project.clientName,
        projectName: project.name,
        title: nextTitle,
        detail: nextDetail,
        priority: normalizedPriority
      });

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos enviar la notificacion del cambio.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <DashboardCard className="h-fit">
        <SectionHeading eyebrow="Solicitud de cambio" title="Contexto rapido" />
        <div className="mt-6 grid gap-4 text-sm leading-6 text-slate-600">
          <p>Proyecto base: {project?.name ?? "Sin proyecto visible"}</p>
          <p>Esta ruta usa el proyecto principal visible para el rol actual y mantiene la misma logica de notificacion al PM asignado.</p>
          {submitted ? <p className="font-medium text-emerald-700">La solicitud ya quedo registrada en la vista local.</p> : null}
          {errorMessage ? <p className="font-medium text-rose-600">{errorMessage}</p> : null}
        </div>
      </DashboardCard>

      <DashboardCard>
        <SectionHeading eyebrow="Completar solicitud" title="Nuevo cambio" />
        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Tipo de cambio
              <select value={changeType} onChange={(event) => setChangeType(event.target.value)} className="dashboard-select">
                <option value="alcance">Alcance</option>
                <option value="contenido">Contenido</option>
                <option value="ux">UX</option>
                <option value="prioridad">Prioridad de sprint</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Prioridad
              <select value={priority} onChange={(event) => setPriority(event.target.value)} className="dashboard-select">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
          </div>
          <TextField label="Titulo corto" placeholder="Ej. Ajustar el orden del home comercial" value={title} onChange={setTitle} />
          <TextAreaField label="Descripcion" placeholder="Explica el cambio, el motivo y si afecta la entrega inmediata." rows={6} value={detail} onChange={setDetail} />
          <button type="submit" className="dashboard-button-primary w-fit">
            Enviar solicitud
          </button>
        </form>
      </DashboardCard>
    </div>
  );
}
