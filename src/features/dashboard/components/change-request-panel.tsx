"use client";

import { useState } from "react";

import { TextAreaField, TextField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";

export function ChangeRequestPanel() {
  const [changeType, setChangeType] = useState("alcance");
  const [priority, setPriority] = useState("media");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !detail.trim()) {
      return;
    }

    setSubmitted(true);
    setTitle("");
    setDetail("");
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.82fr_1.18fr]">
      <DashboardMutedCard>
        <SectionHeading eyebrow="Solicitud de cambio" title="Pide un ajuste con contexto" description="El formulario ya separa tipo, prioridad y detalle para que el PM pueda responder mas rapido." />
        <div className="mt-6 grid gap-4">
          <div className="rounded-[22px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Tipos sugeridos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge tone="accent">Alcance</StatusBadge>
              <StatusBadge>Contenido</StatusBadge>
              <StatusBadge>UX</StatusBadge>
              <StatusBadge>Prioridad de sprint</StatusBadge>
            </div>
          </div>
          {submitted ? <div className="rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-700">Tu solicitud ya quedo lista para la siguiente revision con PM.</div> : null}
        </div>
      </DashboardMutedCard>

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
