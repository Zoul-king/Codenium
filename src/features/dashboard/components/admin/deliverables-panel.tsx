"use client";

import { DashboardCard, SectionHeading } from "@/features/dashboard/components/primitives";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate } from "@/lib/utils/presenters";

export function AdminDeliverablesPanel() {
  const { state } = useDashboardWorkspace();
  const templates = state.documents.filter((document) => document.template);
  const clientVisible = state.documents.filter((document) => document.audience === "client" || document.audience === "shared");

  return (
    <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <DashboardCard>
        <SectionHeading eyebrow="Entregables" title="Plantillas y documentos activos" />
        <div className="mt-8 grid gap-5">
          {templates.map((template) => (
            <div key={template.id} className="dashboard-gridline grid gap-2 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950">{template.title}</p>
                <p className="text-sm font-medium text-slate-500">{template.kind}</p>
              </div>
              <p className="text-sm text-slate-600">Actualizado el {formatShortDate(template.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Compartidos" title="Documentos enviados" />
        <div className="mt-6 grid gap-4">
          {clientVisible.map((document) => (
            <div key={document.id} className="dashboard-gridline grid gap-2 pb-4">
              <p className="font-semibold text-slate-950">{document.title}</p>
              <p className="text-sm text-slate-600">{document.kind}</p>
              <p className="text-sm text-slate-500">Actualizado el {formatShortDate(document.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
