import Link from "next/link";

import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPendingMessages, getProjectsAtRisk, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function PmOverviewPanel() {
  const projects = getVisibleProjects("pm");
  const alerts = getProjectsAtRisk().filter((project) => project.pmId === "user-pm-1");
  const pendingMessages = getPendingMessages("pm");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:grid-rows-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <DashboardCard className="xl:row-span-2">
        <SectionHeading eyebrow="Panel de PM" title="Proyectos asignados" description="Vista compacta para revisar estado, progreso y siguiente entrega sin paneles duplicados." />
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <div className="grid grid-cols-[1.4fr_1fr_0.9fr_0.8fr_0.9fr] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>Proyecto</span>
            <span>Cliente</span>
            <span>Estado</span>
            <span>Progreso</span>
            <span>Entrega</span>
          </div>
          <div className="divide-y divide-slate-200">
            {projects.map((project) => (
              <div key={project.id} className="grid grid-cols-[1.4fr_1fr_0.9fr_0.8fr_0.9fr] gap-3 px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{project.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{project.summary}</p>
                </div>
                <p className="text-sm text-slate-600">{project.clientName}</p>
                <div className="pt-0.5">
                  <StatusBadge tone={project.status === "done" ? "success" : project.progress < 50 ? "warning" : "accent"}>{getProjectStatusLabel(project.status)}</StatusBadge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{project.progress}%</p>
                  <div className="mt-2">
                    <ProgressBar value={project.progress} />
                  </div>
                </div>
                <p className="text-sm text-slate-600">{formatShortDate(project.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Alertas" title="Frentes a destrabar" />
        <div className="mt-6 grid gap-3">
          {alerts.map((project) => (
            <div key={project.id} className="rounded-[20px] border border-amber-100 bg-amber-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{project.name}</p>
                <StatusBadge tone="warning">{project.progress < 50 ? "Riesgo" : "Entrega cercana"}</StatusBadge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Entrega {formatShortDate(project.dueDate)}. Requiere seguimiento con cliente o desbloqueo operativo.</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <DashboardMutedCard>
          <SectionHeading eyebrow="Mensajes pendientes" title={`${pendingMessages.length} por responder`} />
          <div className="mt-6 grid gap-3">
            {pendingMessages.map((message) => (
              <div key={message.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">{message.senderName}</p>
                <p className="mt-1 text-sm text-slate-500">{message.thread}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{message.preview}</p>
              </div>
            ))}
          </div>
        </DashboardMutedCard>

        <DashboardCard>
          <SectionHeading eyebrow="Acciones rapidas" title="Atajos operativos" />
          <div className="mt-6 grid gap-3">
            <Link href="/dashboard/pm/status" className="dashboard-action">
              Actualizar estado de proyecto
            </Link>
            <Link href="/dashboard/pm/messages" className="dashboard-action">
              Abrir conversacion activa
            </Link>
            <Link href="/dashboard/pm/timeline" className="dashboard-action">
              Revisar timeline completo
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
