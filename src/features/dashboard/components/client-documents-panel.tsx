"use client";

import { useMemo, useState } from "react";

import { TextField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectDocuments, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

interface ClientDocumentsPanelProps {
  role?: Extract<Role, "client" | "pm">;
}

export function ClientDocumentsPanel({ role = "client" }: ClientDocumentsPanelProps) {
  const { state, addProjectDocument } = useDashboardWorkspace();
  const clientProject = getPrimaryProject(state, "client");
  const pmProjects = getVisibleProjects(state, "pm");
  const [selectedProjectId, setSelectedProjectId] = useState(pmProjects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("PDF");
  const [href, setHref] = useState("");

  const project = role === "client" ? clientProject : pmProjects.find((item) => item.id === selectedProjectId) ?? pmProjects[0];
  const documents = useMemo(
    () =>
      getProjectDocuments(state, project?.id).filter((document) => (role === "client" ? document.audience !== "pm" && document.audience !== "admin" : document.audience !== "admin")),
    [project?.id, role, state]
  );

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <DashboardCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Entregables" title={project?.name ?? "Sin proyecto"} description="Documentos visibles dentro de la demo actual, conectados al proyecto seleccionado." />
        </div>

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto">
          <div className="grid gap-4">
            {documents.map((document) => (
              <div key={document.id} className="grid gap-4 border-b border-slate-100 pb-4 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-slate-950">{document.title}</p>
                    <StatusBadge tone="accent">{document.kind}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Actualizado el {formatShortDate(document.updatedAt)}</p>
                  <a href={document.href} className="dashboard-link mt-3 inline-flex">
                    Abrir documento
                  </a>
                </div>
                <div className="text-left text-sm text-slate-500 sm:text-right">{document.audience === "shared" ? "Compartido" : "Cliente"}</div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      {role === "pm" ? (
        <DashboardMutedCard>
          <div className="border-b border-slate-200 pb-5">
            <SectionHeading eyebrow="Subir archivo" title="Enviar entregable al proyecto" description="Selecciona cliente y proyecto, luego registra el archivo para que aparezca tambien en el panel del cliente." />
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();

              if (!project || !title.trim()) {
                return;
              }

              addProjectDocument({
                projectId: project.id,
                title: title.trim(),
                kind,
                href,
                audience: "client"
              });

              setTitle("");
              setKind("PDF");
              setHref("");
            }}
          >
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Proyecto
              <select value={project?.id ?? ""} onChange={(event) => setSelectedProjectId(event.target.value)} className="dashboard-select">
                {pmProjects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.clientName} - {item.name}
                  </option>
                ))}
              </select>
            </label>
            <TextField label="Nombre del archivo" placeholder="Ej. Wireframes validados" value={title} onChange={setTitle} />
            <TextField label="Tipo" placeholder="PDF, Figma, Sheet..." value={kind} onChange={setKind} />
            <TextField label="Enlace o referencia" placeholder="https://... o deja vacio para demo interna" value={href} onChange={setHref} />
            <button type="submit" className="dashboard-button-primary w-fit">
              Registrar entregable
            </button>
          </form>
        </DashboardMutedCard>
      ) : (
        <DashboardMutedCard>
          <div className="border-b border-slate-200 pb-5">
            <SectionHeading eyebrow="Contexto" title={project?.planTitle ?? "Plan activo"} />
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-5">
              <p className="text-sm leading-7 text-slate-600">
                Los entregables se muestran con relacion al proyecto activo y al plan contratado para que el seguimiento no dependa de mensajes dispersos.
              </p>
            </div>
          </div>
        </DashboardMutedCard>
      )}
    </div>
  );
}
