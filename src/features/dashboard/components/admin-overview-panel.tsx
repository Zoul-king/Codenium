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
    <div className="grid h-full gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:grid-rows-[minmax(0,1fr)_minmax(0,0.88fr)]">
      <DashboardCard className="xl:row-span-2">
        <SectionHeading eyebrow="Operación comercial" title="Cotizaciones activas" description="Prioriza aprobación, ajustes y asignación de PM." action={<Link href="/dashboard/admin/quotes" className="dashboard-link">Ir a cotizaciones</Link>} />
        <div className="mt-4 grid gap-2">
          {openQuotes.map((quote) => (
            <div key={quote.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{quote.code}</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{quote.title}</p>
                  <p className="text-xs text-slate-500">{quote.clientName}</p>
                </div>
                <StatusBadge tone={quote.status === "review" ? "warning" : "accent"}>{getQuoteStatusLabel(quote.status)}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Proyectos en riesgo" title="Actividad sensible" />
        <div className="mt-4 grid gap-2">
          {riskyProjects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-rose-50 bg-rose-50/50 p-3 pr-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-900">{project.name}</p>
                <StatusBadge tone="danger">{project.progress <= 45 ? "Bajo progreso" : "Cercano"}</StatusBadge>
              </div>
              <p className="mt-1 text-xs text-slate-600">{project.clientName} · {project.progress}% completado</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <DashboardMutedCard>
          <SectionHeading eyebrow="PMs" title="Carga de equipo" action={<Link href="/dashboard/admin/team" className="dashboard-link">Ver más</Link>} />
          <div className="mt-4 grid gap-2">
            {pmUsers.map((pm) => {
              const stats = getPmStats(pm.id);

              return (
                <div key={pm.id} className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-sm font-bold text-slate-900">{pm.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{stats.activeProjects} activos · {stats.completedProjects} listos</p>
                </div>
              );
            })}
          </div>
        </DashboardMutedCard>

        <DashboardCard>
          <SectionHeading eyebrow="Métricas" title="Lectura rápida" />
          <div className="mt-4 grid gap-2">
            <MetricPill label="Cotizaciones" value={String(openQuotes.length)} tone="accent" />
            <MetricPill label="En riesgo" value={String(riskyProjects.length)} />
            <MetricPill label="PMs" value={String(pmUsers.length)} />
          </div>
        </DashboardCard>
      </div>
    </div>

  );
}
