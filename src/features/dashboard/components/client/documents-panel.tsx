"use client";

import { useMemo, useState } from "react";

import { TextField } from "@/components/common/form-field";
import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading } from "@/features/dashboard/components/primitives";
import { getProjectClientEmail } from "@/features/dashboard/lib/recipients";
import { getProjectDocuments, getSelectedProject } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import { formatShortDate } from "@/lib/utils/presenters";
import type { Role } from "@/lib/types/domain";

interface ClientDocumentsPanelProps {
  role?: Extract<Role, "client" | "pm">;
}

export function ClientDocumentsPanel({ role = "client" }: ClientDocumentsPanelProps) {
  const { state, addProjectDocument } = useDashboardWorkspace();
  const project = getSelectedProject(state, role);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("PDF");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [notice, setNotice] = useState("");

  const documents = useMemo(
    () =>
      getProjectDocuments(state, project?.id).filter((document) => (role === "client" ? document.audience !== "pm" && document.audience !== "admin" : document.audience !== "admin")),
    [project?.id, role, state]
  );

  if (!project) {
    return (
      <DashboardCard>
        <DashboardEmptyState title="Selecciona un proyecto" body="Los entregables visibles dependen del proyecto activo que elijas en la vista de proyectos." />
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_320px]">
      <DashboardCard>
        <SectionHeading title={project.name} description={role === "client" ? "Aqui ves los entregables del proyecto seleccionado." : "Los entregables registrados aqui se reflejan en el dashboard del cliente."} />

        <div className="mt-5 grid gap-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <article key={document.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{document.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{document.kind}</p>
                  </div>
                  <p className="text-xs text-slate-500">{formatShortDate(document.updatedAt)}</p>
                </div>
                <a href={document.href} className="dashboard-link mt-3 inline-flex">
                  Abrir documento
                </a>
              </article>
            ))
          ) : (
            <DashboardEmptyState title="Sin entregables" body="Todavia no hay archivos registrados para este proyecto." />
          )}
        </div>
      </DashboardCard>

      {role === "pm" ? (
        <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
          <SectionHeading title="Registrar PDF" />
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault();

              if (!title.trim() || !selectedFileName) {
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

                if (!recipientEmail) {
                  throw new Error("No encontramos el correo del cliente para notificar.");
                }

                await sendDashboardNotification({
                  type: "deliverable_notification",
                  recipientEmail,
                  recipientName: project.clientName,
                  projectName: project.name,
                  title: nextTitle,
                  kind,
                  fileName: selectedFileName,
                  registeredBy: state.users.find((user) => user.id === project.pmId)?.name ?? "PM asignado"
                });

                setNotice("");
              } catch (error) {
                setNotice(error instanceof Error ? error.message : "No pudimos enviar la notificacion del entregable.");
              }
            }}
          >
            <TextField label="Nombre del entregable" placeholder="Ej. Sprint 2 validado" value={title} onChange={setTitle} />
            <TextField label="Tipo" placeholder="PDF" value={kind} onChange={setKind} />
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Archivo PDF
              <input
                type="file"
                accept="application/pdf"
                className="block w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
              />
            </label>
            {selectedFileName ? <p className="text-xs text-slate-500">Listo para registrar: {selectedFileName}</p> : null}
            {notice ? <p className="text-sm font-medium text-rose-600">{notice}</p> : null}
            <button type="submit" className="dashboard-button-primary w-full justify-center">
              Registrar entregable
            </button>
          </form>
        </DashboardMutedCard>
      ) : (
        <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
          <SectionHeading title="Referencia" />
          <p className="mt-4 text-sm leading-6 text-slate-600">Si el PM registra un nuevo PDF para este proyecto, aparecerá aqui automaticamente.</p>
        </DashboardMutedCard>
      )}
    </div>
  );
}
