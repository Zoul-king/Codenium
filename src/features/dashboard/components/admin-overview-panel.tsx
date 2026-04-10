"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getClientUsers, getPmUsers, getProjectsAtRisk, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";

const today = "2026-04-10";

export function AdminOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const quotes = getVisibleQuotes(state, "admin");
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const projectsInProgress = state.projects.filter((project) => project.status !== "done");
  const projectsAtRisk = getProjectsAtRisk(state);
  const prequotesToday = quotes.filter((quote) => quote.quoteKind === "prequote" && quote.createdAt === today).length;
  const acceptedToday = quotes.filter((quote) => quote.acceptedAt === today).length;
  const createdUsersToday = state.users.filter((user) => user.createdAt === today).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
      <div className="grid gap-6">
        <DashboardCard>
          <SectionHeading eyebrow="Control general" title="Lectura ejecutiva del sistema" description="Metricas clave de entrada comercial, operacion activa y capacidad del equipo." />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricBlock label="Precotizaciones hoy" value={String(prequotesToday)} helper="Nuevas oportunidades" />
            <MetricBlock label="Aceptadas hoy" value={String(acceptedToday)} helper="Conversion del dia" />
            <MetricBlock label="Usuarios nuevos" value={String(createdUsersToday)} helper="Altas registradas" />
            <MetricBlock label="Proyectos activos" value={String(projectsInProgress.length)} helper="Operacion en curso" />
          </div>
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Operacion" title="Frentes que requieren atencion" />
          <div className="mt-6 grid gap-4">
            {projectsAtRisk.map((project) => (
              <article key={project.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{project.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{project.clientName}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
                  </div>
                  <StatusBadge tone="warning">{project.progress}% de avance</StatusBadge>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>Entrega {project.dueDate}</span>
                  <span>{project.intakeSource === "service" ? "Servicio" : "Plan"}: {project.selectionLabel}</span>
                </div>
              </article>
            ))}
            {projectsAtRisk.length === 0 ? <p className="text-sm text-slate-600">No hay proyectos con senales de riesgo en este corte.</p> : null}
          </div>
        </DashboardMutedCard>
      </div>

      <div className="grid h-fit gap-6 xl:sticky xl:top-6">
        <DashboardCard>
          <SectionHeading eyebrow="Capacidad" title="Cobertura actual" />
          <div className="mt-6 grid gap-4">
            <CompactRow label="Clientes activos" value={String(clients.filter((user) => user.state === "active").length)} />
            <CompactRow label="PM activos" value={String(pms.filter((user) => user.state === "active").length)} />
            <CompactRow label="Leads por plan" value={String(quotes.filter((quote) => quote.intakeSource === "plan").length)} />
            <CompactRow label="Leads por servicio" value={String(quotes.filter((quote) => quote.intakeSource === "service").length)} />
          </div>
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Finanzas" title="Pagos pendientes" />
          <p className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-slate-950">{state.payments.filter((payment) => payment.status !== "paid").length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Pendientes de confirmacion o programados para proyectos activos.</p>
        </DashboardMutedCard>
      </div>
    </div>
  );
}

function MetricBlock({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-[32px] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

function CompactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-semibold text-slate-950">{value}</span>
    </div>
  );
}
