"use client";

import { useMemo, useState } from "react";

import { TextField } from "@/components/ui/form-controls";
import { DashboardCard, DataRow, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getProjectClientEmail } from "@/features/dashboard/lib/recipients";
import { getPrimaryProject, getProjectDocuments, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/client-api";
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
  const [selectedFileName, setSelectedFileName] = useState("");
  const [notice, setNotice] = useState("");

  const project = role === "client" ? clientProject : pmProjects.find((item) => item.id === selectedProjectId) ?? pmProjects[0];
  const documents = useMemo(
    () =>
      getProjectDocuments(state, project?.id).filter((document) => (role === "client" ? document.audience !== "pm" && document.audience !== "admin" : document.audience !== "admin")),
    [project?.id, role, state]
  );

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.06fr)_340px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Entregables" title={project?.name ?? "Sin proyecto"} />

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto">
          <div className="grid gap-5">
            {documents.map((document) => (
              <div key={document.id} className="dashboard-gridline grid gap-2 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">{document.title}</p>
                  <p className="text-sm font-medium text-slate-500">{document.kind}</p>
                </div>
                <p className="text-sm text-slate-500">Actualizado el {formatShortDate(document.updatedAt)}</p>
                <a href={document.href} className="dashboard-link mt-1 inline-flex">
                  Abrir documento
                </a>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      {role === "pm" ? (
        <DashboardCard className="h-fit xl:sticky xl:top-6">
          <SectionHeading eyebrow="Subir PDF" title="Registrar entregable" />

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();

              if (!project || !title.trim() || !selectedFileName) {
                return;
              }

              const nextTitle = title.trim();

              addProjectDocument({
                projectId: project.id,
                title: nextTitle,
                kind,
                href: `#${selectedFileName.toLowerCase().replace(/\s+/g, "-")}`,
                audience: "client"
              });

              setTitle("");
              setKind("PDF");
              setSelectedFileName("");

              try {
                const recipientEmail = getProjectClientEmail(state, project.id);
                const recipientName = project.clientName;
                const registeredBy = state.users.find((user) => user.id === project.pmId)?.name ?? "PM asignado";

                if (!recipientEmail) {
                  throw new Error("No encontramos el correo del cliente para notificar.");
                }

                await sendDashboardNotification({
                  type: "deliverable_notification",
                  recipientEmail,
                  recipientName,
                  projectName: project.name,
                  title: nextTitle,
                  kind,
                  fileName: selectedFileName,
                  registeredBy
                });

                setNotice("");
              } catch (error) {
                setNotice(error instanceof Error ? error.message : "No pudimos enviar la notificacion del entregable.");
              }
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

            <TextField label="Nombre del archivo" placeholder="Ej. Propuesta validada" value={title} onChange={setTitle} />
            <TextField label="Tipo" placeholder="PDF" value={kind} onChange={setKind} />

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              PDF
              <input
                type="file"
                accept="application/pdf"
                className="block w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
              />
            </label>

            {selectedFileName ? <p className="text-sm text-slate-500">Archivo listo: {selectedFileName}</p> : null}
            {notice ? <p className="text-sm font-medium text-rose-600">{notice}</p> : null}

            <button type="submit" className="dashboard-button-primary w-fit">
              Registrar entregable
            </button>
          </form>
        </DashboardCard>
      ) : (
        <DashboardCard className="h-fit xl:sticky xl:top-6">
          <SectionHeading eyebrow="Resumen" title={project?.selectionLabel ?? "Proyecto activo"} />
          <div className="mt-6">
            <DataRow label="Origen" value={project?.intakeSource === "service" ? "Servicio" : "Plan"} className="pt-0" />
            <DataRow label="Entrega mas cercana" value={documents[0] ? formatShortDate(documents[0].updatedAt) : "Pendiente"} />
            <DataRow label="Documentos visibles" value={String(documents.length)} className="border-b-0 pb-0" />
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
