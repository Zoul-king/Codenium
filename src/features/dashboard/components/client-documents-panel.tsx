import Link from "next/link";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectDocuments } from "@/features/dashboard/lib/selectors";
import { formatShortDate } from "@/lib/presenters";

export function ClientDocumentsPanel() {
  const project = getPrimaryProject("client");
  const documents = getProjectDocuments(project?.id);
  const primaryDocuments = documents.slice(0, 3);
  const supportDocuments = documents.slice(3);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Documentos clave" title="Lo importante primero" description="Priorizamos alcance, diseno y materiales de salida para que no tengas que revisar una lista plana." />
        <div className="mt-6 grid gap-4">
          {primaryDocuments.map((document) => (
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
        <SectionHeading eyebrow="Apoyo" title="Referencias complementarias" description="Solo dejamos visibles archivos utiles para el momento actual del proyecto." />
        <div className="mt-6 grid gap-3">
          {supportDocuments.map((document) => (
            <div key={document.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{document.title}</p>
                <StatusBadge>{document.kind}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-slate-600">Actualizado el {formatShortDate(document.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
