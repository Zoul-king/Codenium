"use client";

import { DataRow, DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getClientUsers, getPmUsers, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";

const today = "2026-04-10";

export function AdminOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const quotes = getVisibleQuotes(state, "admin");
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const projectsInProgress = state.projects.filter((project) => project.status !== "done");
  const prequotesToday = quotes.filter((quote) => quote.quoteKind === "prequote" && quote.createdAt === today).length;
  const acceptedToday = quotes.filter((quote) => quote.acceptedAt === today).length;
  const createdUsersToday = state.users.filter((user) => user.createdAt === today).length;
  const serviceLeads = quotes.filter((quote) => quote.intakeSource === "service");
  const planLeads = quotes.filter((quote) => quote.intakeSource === "plan");

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Overview" title="Pulso operativo" />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <MetricChart
            title="Entrada comercial"
            items={[
              { label: "Planes", value: planLeads.length, colorClassName: "bg-primary-500" },
              { label: "Servicios", value: serviceLeads.length, colorClassName: "bg-secondary-500" },
              { label: "Aprobadas", value: quotes.filter((quote) => quote.status === "approved").length, colorClassName: "bg-slate-950" }
            ]}
          />
          <MetricChart
            title="Operacion"
            items={[
              { label: "Proyectos activos", value: projectsInProgress.length, colorClassName: "bg-slate-950" },
              { label: "PM activos", value: pms.filter((user) => user.state === "active").length, colorClassName: "bg-primary-500" },
              { label: "Clientes activos", value: clients.filter((user) => user.state === "active").length, colorClassName: "bg-secondary-500" }
            ]}
          />
        </div>

        <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-4">
          <MiniMetric label="Precotizaciones hoy" value={String(prequotesToday)} />
          <MiniMetric label="Aceptadas hoy" value={String(acceptedToday)} />
          <MiniMetric label="Usuarios nuevos" value={String(createdUsersToday)} />
          <MiniMetric label="Proyectos activos" value={String(projectsInProgress.length)} />
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Corte rapido" title="Lectura del dia" />
        <div className="mt-6">
          <DataRow label="Leads por plan" value={String(planLeads.length)} className="pt-0" />
          <DataRow label="Leads por servicio" value={String(serviceLeads.length)} />
          <DataRow label="Usuarios registrados" value={String(state.users.length)} />
          <DataRow label="PM disponibles" value={String(pms.filter((user) => user.state === "active").length)} className="border-b-0 pb-0" />
        </div>
      </DashboardCard>
    </div>
  );
}

function MetricChart({
  title,
  items
}: {
  title: string;
  items: Array<{ label: string; value: number; colorClassName: string }>;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-5">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
            <div className="h-3 rounded-full bg-white">
              <div className={`${item.colorClassName} h-full rounded-full`} style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-slate-200 pl-4 first:border-l-0 first:pl-0">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
    </div>
  );
}
