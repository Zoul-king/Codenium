"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getClientUsers, getPmUsers, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";

const today = "2026-04-10";

export function AdminOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const quotes = getVisibleQuotes(state, "admin");
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const projectsInProgress = state.projects.filter((project) => project.status !== "done");
  const pendingQuotes = quotes.filter((quote) => quote.status !== "approved");
  const prequotesToday = quotes.filter((quote) => quote.quoteKind === "prequote" && quote.createdAt === today).length;
  const acceptedToday = quotes.filter((quote) => quote.acceptedAt === today).length;
  const createdUsersToday = state.users.filter((user) => user.createdAt === today).length;
  const activeUsersToday = new Set(
    state.messages.filter((message) => message.sentAt.startsWith("Hoy")).flatMap((message) => [message.senderId, message.recipientId].filter(Boolean))
  ).size;

  const quoteChart = [
    { label: "Precotizaciones hoy", value: prequotesToday, color: "bg-primary-500" },
    { label: "Aceptadas hoy", value: acceptedToday, color: "bg-secondary-500" },
    { label: "Pendientes", value: pendingQuotes.length, color: "bg-amber-400" }
  ];

  const audienceChart = [
    { label: "PM totales", value: pms.length, color: "bg-primary-500" },
    { label: "Usuarios registrados", value: state.users.length, color: "bg-secondary-500" },
    { label: "Proyectos en desarrollo", value: projectsInProgress.length, color: "bg-slate-900" }
  ];

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <DashboardCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Metricas" title="Pulso administrativo del dia" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Usuarios activos hoy" value={String(activeUsersToday)} helper="Actividad detectada en mensajes de hoy" accent />
          <MetricTile label="Precotizaciones hoy" value={String(prequotesToday)} helper="Nuevas precotizaciones creadas hoy" />
          <MetricTile label="Aceptadas hoy" value={String(acceptedToday)} helper="Cotizaciones convertidas hoy" />
          <MetricTile label="Cuentas creadas hoy" value={String(createdUsersToday)} helper="Altas registradas en la demo" />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <ChartBlock title="Ritmo comercial" items={quoteChart} />
          <ChartBlock title="Base operativa" items={audienceChart} />
        </div>
      </DashboardCard>

      <DashboardMutedCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Totales" title="Lectura rapida" />
        </div>

        <div className="mt-6 grid gap-4">
          <SummaryRow label="Clientes activos" value={String(clients.filter((user) => user.state === "active").length)} />
          <SummaryRow label="PM activos" value={String(pms.filter((user) => user.state === "active").length)} />
          <SummaryRow label="Usuarios registrados" value={String(state.users.length)} />
          <SummaryRow label="Proyectos en desarrollo" value={String(projectsInProgress.length)} />
          <SummaryRow label="Cotizaciones pendientes" value={String(pendingQuotes.length)} />
          <SummaryRow label="Precotizaciones totales" value={String(quotes.filter((quote) => quote.quoteKind === "prequote").length)} />
        </div>
      </DashboardMutedCard>
    </div>
  );
}

function MetricTile({ label, value, helper, accent = false }: { label: string; value: string; helper: string; accent?: boolean }) {
  return (
    <div className={`rounded-[18px] border px-5 py-5 ${accent ? "border-primary-100 bg-primary-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}

function ChartBlock({ title, items }: { title: string; items: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-5">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-white">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 pb-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
