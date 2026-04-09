import Link from "next/link";

import { DashboardCard, DashboardMutedCard, MetricPill, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPmStats, getPmUsers, getProjectsAtRisk } from "@/features/dashboard/lib/selectors";
import { mockQuotes } from "@/lib/mocks";
import { getQuoteStatusLabel } from "@/lib/presenters";

export function AdminOverviewPanel() {
  const openQuotes = mockQuotes.filter((quote) => quote.status !== "approved");
  const riskyProjects = getProjectsAtRisk();
  const pmUsers = getPmUsers();

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:grid-rows-[minmax(0,1fr)_minmax(0,0.88fr)]">
      <DashboardCard className="xl:row-span-2">
        <SectionHeading eyebrow="Operacion comercial" title="Cotizaciones activas" description="La home prioriza aprobacion, ajustes y asignacion de PM antes de que una cotizacion se convierta en proyecto." action={<Link href="/dashboard/admin/quotes" className="dashboard-link">Ir a cotizaciones</Link>} />
        <div className="mt-6 grid gap-3">
          {openQuotes.map((quote) => (
            <div key={quote.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{quote.code}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{quote.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{quote.clientName}</p>
                </div>
                <StatusBadge tone={quote.status === "review" ? "warning" : "accent"}>{getQuoteStatusLabel(quote.status)}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Proyectos en riesgo" title="Retrasos o actividad sensible" />
        <div className="mt-6 grid gap-3">
          {riskyProjects.map((project) => (
            <div key={project.id} className="rounded-[20px] border border-rose-100 bg-rose-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{project.name}</p>
                <StatusBadge tone="danger">{project.progress <= 45 ? "Progreso bajo" : "Entrega cercana"}</StatusBadge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{project.clientName} y {project.progress}% completado.</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <DashboardMutedCard>
          <SectionHeading eyebrow="PMs" title="Carga actual del equipo" action={<Link href="/dashboard/admin/team" className="dashboard-link">Ver detalle</Link>} />
          <div className="mt-6 grid gap-3">
            {pmUsers.map((pm) => {
              const stats = getPmStats(pm.id);

              return (
                <div key={pm.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-950">{pm.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{stats.activeProjects} activos y {stats.completedProjects} completados</p>
                </div>
              );
            })}
          </div>
        </DashboardMutedCard>

        <DashboardCard>
          <SectionHeading eyebrow="Metricas utiles" title="Lectura rapida" />
          <div className="mt-6 grid gap-3">
            <MetricPill label="Cotizaciones abiertas" value={String(openQuotes.length)} tone="accent" />
            <MetricPill label="Proyectos en riesgo" value={String(riskyProjects.length)} />
            <MetricPill label="PMs activos" value={String(pmUsers.length)} />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
