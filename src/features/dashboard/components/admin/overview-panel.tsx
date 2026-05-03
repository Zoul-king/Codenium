"use client";

import { ArrowDownRight, ArrowUpRight, Activity, AlertTriangle, FileText, MoreHorizontal, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getClientUsers,
  getPmUsers,
  getProjectsAtRisk,
  getVisibleQuotes
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel, getQuoteStatusLabel } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

const TODAY = new Date().toISOString().slice(0, 10);

export function AdminOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const quotes = getVisibleQuotes(state, "admin");
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const projectsInProgress = state.projects.filter((p) => p.status !== "done");
  const projectsAtRisk = getProjectsAtRisk(state);

  const prequotesToday = quotes.filter((q) => q.quoteKind === "prequote" && q.createdAt === TODAY).length;
  const acceptedToday = quotes.filter((q) => q.acceptedAt === TODAY).length;
  const newUsersToday = state.users.filter((u) => u.createdAt === TODAY).length;
  const pendingPayments = state.payments.filter((p) => p.status !== "paid").length;
  const totalRevenue = state.payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const conversionRate = quotes.length > 0
    ? Math.round((quotes.filter((q) => q.status === "accepted").length / quotes.length) * 100)
    : 0;

  // Sparkline data (mock 7-day trend; in real DB-backed app come from aggregates)
  const sparkData = [42, 45, 38, 52, 48, 61, 55];
  const sparkAccepted = [3, 5, 4, 7, 6, 8, 9];
  const sparkUsers = [12, 14, 13, 18, 16, 20, 22];
  const sparkRevenue = [12000, 15000, 14500, 19000, 22000, 20500, 24800];
  const sparkConversion = [28, 32, 30, 35, 38, 36, 42];
  const sparkPending = [8, 10, 9, 11, 12, 10, 13];
  const sparkProjects = projectsInProgress.length;

  return (
    <div className="space-y-6">
      {/* KPI ROW */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Precotizaciones hoy" value={prequotesToday} delta="+12%" deltaTone="up" spark={sparkData} />
        <KpiCard label="Aceptadas hoy" value={acceptedToday} delta="+24%" deltaTone="up" spark={sparkAccepted} />
        <KpiCard label="Conversión" value={`${conversionRate}%`} delta="+5pts" deltaTone="up" spark={sparkConversion} />
        <KpiCard label="Usuarios nuevos" value={newUsersToday} delta="+18%" deltaTone="up" spark={sparkUsers} />
        <KpiCard
          label="Proyectos activos"
          value={projectsInProgress.length}
          delta="0"
          deltaTone="flat"
          spark={[sparkProjects, sparkProjects, sparkProjects, sparkProjects, sparkProjects, sparkProjects, sparkProjects]}
        />
        <KpiCard label="Pagos pendientes" value={pendingPayments} delta="-3" deltaTone="down" spark={sparkPending} />
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* TABS WITH TABLE */}
        <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white shadow-[var(--shadow-card-dense)]">
          <Tabs defaultValue="recent">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Operación
                </p>
                <h2 className="text-base font-semibold text-slate-950">Cotizaciones y proyectos</h2>
              </div>
              <TabsList variant="line" className="bg-transparent">
                <TabsTrigger value="recent">Recientes</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="risk">
                  Atención {projectsAtRisk.length > 0 ? `(${projectsAtRisk.length})` : ""}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.slice(0, 8).map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-950">{quote.title}</p>
                          <p className="text-[11px] text-slate-500">{quote.code}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">{quote.clientName}</TableCell>
                      <TableCell>
                        <QuoteStatusBadge status={quote.status} />
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {formatShortDate(quote.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {quotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        Aún no se registran cotizaciones.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pipeline" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Fase</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead className="text-right">Entrega</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectsInProgress.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <p className="font-medium text-slate-950">{project.name}</p>
                        <p className="text-[11px] text-slate-500">{project.clientName}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {getProjectStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[var(--role-strong,#4f2f96)]"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {formatShortDate(project.dueDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {projectsInProgress.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        Sin proyectos en curso.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="risk" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead className="text-right">Entrega</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectsAtRisk.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="size-3.5 text-warning-600" />
                          <p className="font-medium text-slate-950">{project.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">{project.clientName}</TableCell>
                      <TableCell>
                        <span className="badge-status-warning">{project.progress}%</span>
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {formatShortDate(project.dueDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {projectsAtRisk.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        No hay proyectos en riesgo.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDE PANEL */}
        <aside className="space-y-4">
          <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card-dense)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="kpi-label">Capacidad del equipo</p>
                <h3 className="mt-1 text-base font-semibold text-slate-950">Cobertura activa</h3>
              </div>
              <Users className="size-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              <CompactRow
                label="Clientes activos"
                value={clients.filter((u) => u.state === "active").length}
                total={clients.length}
              />
              <CompactRow
                label="PMs activos"
                value={pms.filter((u) => u.state === "active").length}
                total={pms.length}
              />
              <CompactRow
                label="Proyectos en curso"
                value={projectsInProgress.length}
                total={state.projects.length}
              />
            </div>
            <Link
              href="/dashboard/admin/users"
              className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--role-strong,#3f237a)] hover:underline"
            >
              Gestionar equipo →
            </Link>
          </div>

          <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-gradient-to-br from-[var(--role-soft,#efe9fb)] to-white p-5 shadow-[var(--shadow-card-dense)]">
            <div className="flex items-center justify-between">
              <p className="kpi-label">Cobrado este mes</p>
              <TrendingUp className="size-4 text-[var(--role-strong,#3f237a)]" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              ${totalRevenue.toLocaleString("es-MX")}
            </p>
            <Sparkline data={sparkRevenue} className="mt-3 text-[var(--role-strong,#3f237a)]" />
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="kpi-delta-up">
                <ArrowUpRight className="size-3" />
                +18% vs mes anterior
              </span>
              <Link
                href="/dashboard/admin/payments"
                className="font-semibold text-[var(--role-strong,#3f237a)] hover:underline"
              >
                Ver detalle →
              </Link>
            </div>
          </div>

          <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card-dense)]">
            <div className="flex items-center justify-between">
              <p className="kpi-label">Actividad reciente</p>
              <Activity className="size-4 text-slate-400" />
            </div>
            <ul className="mt-3 space-y-3 text-sm">
              <ActivityItem
                icon={<FileText className="size-3" />}
                text={`${prequotesToday} cotizaciones nuevas hoy`}
                time="hace 2h"
              />
              <ActivityItem
                icon={<Users className="size-3" />}
                text={`${newUsersToday} usuarios registrados`}
                time="hace 4h"
              />
              <ActivityItem
                icon={<TrendingUp className="size-3" />}
                text={`${acceptedToday} cotizaciones aceptadas`}
                time="hace 6h"
              />
              <ActivityItem
                icon={<MoreHorizontal className="size-3" />}
                text="Sincronización de pagos"
                time="hace 8h"
              />
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  delta: string;
  deltaTone: "up" | "down" | "flat";
  spark: number[];
}

function KpiCard({ label, value, delta, deltaTone, spark }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="kpi-value">{value}</p>
        <span
          className={cn(
            deltaTone === "up" ? "kpi-delta-up" : deltaTone === "down" ? "kpi-delta-down" : "kpi-delta-flat"
          )}
        >
          {deltaTone === "up" ? <ArrowUpRight className="size-3" /> : null}
          {deltaTone === "down" ? <ArrowDownRight className="size-3" /> : null}
          {delta}
        </span>
      </div>
      <Sparkline data={spark} className="mt-3 text-[var(--role-strong,#3f237a)]" />
    </div>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("h-8 w-full", className)}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        points={points}
      />
    </svg>
  );
}

function CompactRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-950">
          {value} <span className="text-slate-400">/ {total}</span>
        </span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[var(--role-strong,#3f237a)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time }: { icon: React.ReactNode; text: string; time: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--role-soft,#efe9fb)] text-[var(--role-strong,#3f237a)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-5 text-slate-700">{text}</p>
        <p className="text-[10px] text-slate-400">{time}</p>
      </div>
    </li>
  );
}

function QuoteStatusBadge({ status }: { status: "pending" | "reviewed" | "accepted" | "rejected" }) {
  const cls = {
    pending: "badge-status-warning",
    reviewed: "badge-status-info",
    accepted: "badge-status-success",
    rejected: "badge-status-error"
  }[status];

  return <span className={cls}>{getQuoteStatusLabel(status)}</span>;
}
