"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate } from "@/lib/presenters";

export function AdminDeliverablesPanel() {
  const { state } = useDashboardWorkspace();
  const templates = state.documents.filter((document) => document.template);
  const clientVisible = state.documents.filter((document) => document.audience === "client" || document.audience === "shared");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1fr_1fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Entregables" title="Plantillas listas para cliente" />
        <div className="mt-6 grid gap-4">
          {templates.map((template) => (
            <div key={template.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950">{template.title}</p>
                <StatusBadge tone="accent">{template.kind}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-slate-600">Actualizado el {formatShortDate(template.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Compartidos" title="Documentos enviados al cliente" />
        <div className="mt-6 grid gap-3">
          {clientVisible.map((document) => (
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
