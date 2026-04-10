"use client";

import { DashboardCard, DashboardMutedCard, MetricPill, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getClientUsers, getPmUsers, getProjectsAtRisk, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";

export function AdminOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const quotes = getVisibleQuotes(state, "admin");
  const prequotes = quotes.filter((quote) => quote.quoteKind === "prequote");
  const riskyProjects = getProjectsAtRisk(state);
  const pmUsers = getPmUsers(state);
  const clients = getClientUsers(state);

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Metricas" title="Lectura ejecutiva del sistema" description="La operacion enlaza precotizaciones, proyectos en riesgo, usuarios y pagos pendientes desde un mismo tablero." />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricPill label="Precotizaciones" value={String(prequotes.length)} tone="accent" />
          <MetricPill label="Proyectos en riesgo" value={String(riskyProjects.length)} />
          <MetricPill label="Clientes activos" value={String(clients.filter((user) => user.state === "active").length)} />
          <MetricPill label="PMs activos" value={String(pmUsers.filter((user) => user.state === "active").length)} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Cotizaciones para convertir</p>
            <div className="mt-4 grid gap-3">
              {prequotes.map((quote) => (
                <div key={quote.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{quote.title}</p>
                    <StatusBadge tone="warning">Precotizacion</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{quote.clientName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Alertas operativas</p>
            <div className="mt-4 grid gap-3">
              {riskyProjects.map((project) => (
                <div key={project.id} className="rounded-[18px] border border-rose-100 bg-rose-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{project.name}</p>
                    <StatusBadge tone="danger">Seguimiento</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{project.clientName} · {project.progress}% completado</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Coordinacion" title="Flujo entre roles" />
        <div className="mt-6 grid gap-3">
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-950">Admin → Cliente y PM</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Acepta precotizaciones, asigna PM y valida pagos o entregables visibles para ambos frentes.</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-950">PM → Cliente</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Al cerrar un hito, el cliente ve el impacto inmediato en pagos y seguimiento operativo.</p>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-950">Cliente → PM</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">El cliente registra cambios y mensajes dentro del mismo proyecto conectado.</p>
          </div>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
