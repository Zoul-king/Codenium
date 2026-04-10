"use client";

import Link from "next/link";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectDocuments } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

interface ClientDocumentsPanelProps {
  role?: Extract<Role, "client" | "pm">;
}

export function ClientDocumentsPanel({ role = "client" }: ClientDocumentsPanelProps) {
  const { state } = useDashboardWorkspace();
  const project = getPrimaryProject(state, role === "client" ? "client" : "pm");
  const documents = getProjectDocuments(state, project?.id).filter((document) =>
    role === "client" ? document.audience !== "pm" : document.audience !== "admin"
  );

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <DashboardCard>
        <SectionHeading
          eyebrow={role === "client" ? "Entregables" : "Entregables activos"}
          title={role === "client" ? "Lo importante primero" : "Documentos listos para cliente"}
          description={role === "client" ? "Priorizamos alcance, diseno y materiales de salida para que no tengas que revisar una lista plana." : "El PM concentra lo compartido con cliente y los soportes operativos del proyecto."}
        />
        <div className="mt-6 grid gap-4">
          {documents.map((document) => (
            <div key={document.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">{document.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Actualizado el {formatShortDate(document.updatedAt)}</p>
                </div>
                <StatusBadge tone="accent">{document.kind}</StatusBadge>
              </div>
              <Link href={document.href} className="dashboard-link mt-4 inline-flex">
                Abrir documento
              </Link>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Contexto" title={project?.planTitle ?? "Plan activo"} />
        <div className="mt-6 grid gap-3">
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-950">{project?.name ?? "Sin proyecto"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {role === "client"
                ? "Tus entregables mantienen relacion con el plan contratado y el proyecto visible dentro del panel."
                : "Esta vista permite al PM revisar que materiales estan listos antes de compartirlos con cliente."}
            </p>
          </div>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
