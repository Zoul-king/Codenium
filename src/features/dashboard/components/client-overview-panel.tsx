import Link from "next/link";

import { DashboardCard, DashboardMutedCard, MetricPill, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getLatestMilestone, getPrimaryProject, getProjectMessages } from "@/features/dashboard/lib/selectors";
import { formatLongDate, formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const project = getPrimaryProject("client");
  const latestMilestone = getLatestMilestone(project?.id);
  const recentMessages = getProjectMessages(project?.id).slice(-3).reverse();

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <DashboardCard className="max-w-xl">
          <SectionHeading eyebrow="Panel de cliente" title="Todavia no tienes un proyecto activo" description="Cuando una cotizacion pase a ejecucion, aqui veras entregas, mensajes y documentos sin rutas de relleno." />
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <DashboardCard className="xl:row-span-1">
        <SectionHeading eyebrow="Proyecto activo" title={project.name} description={project.summary} />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricPill label="Estado" value={getProjectStatusLabel(project.status)} tone="accent" />
          <MetricPill label="Progreso" value={`${project.progress}%`} />
          <MetricPill label="Proxima entrega" value={formatShortDate(project.dueDate)} />
        </div>
        <div className="mt-5">
          <ProgressBar value={project.progress} />
        </div>
        <div className="mt-6 grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-500">Estado actual</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{getProjectStatusLabel(project.status)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Seguimos el proyecto en un solo flujo: avance, mensajes y proximos pasos dentro del mismo panel.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Siguiente checkpoint</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatLongDate(project.dueDate)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">La fecha visible ya refleja el siguiente entregable comprometido con tu PM.</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Ultimo hito" title={latestMilestone?.title ?? "Sin hitos registrados"} description={latestMilestone?.summary ?? "Tu PM agregara aqui el siguiente avance confirmado."} />
        <div className="mt-6 flex items-center justify-between">
          <StatusBadge tone={latestMilestone?.status === "done" ? "success" : latestMilestone?.status === "current" ? "accent" : "warning"}>
            {latestMilestone?.status === "done" ? "Completado" : latestMilestone?.status === "current" ? "En curso" : "Proximo"}
          </StatusBadge>
          <p className="text-sm font-medium text-slate-600">{latestMilestone ? formatLongDate(latestMilestone.date) : "Sin fecha"}</p>
        </div>
      </DashboardMutedCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Acciones rapidas" title="Resuelve lo importante sin navegar de mas" />
        <div className="mt-6 grid gap-3">
          <Link href="/dashboard/client/docs" className="dashboard-action">
            Ver documentos clave
          </Link>
          <Link href="/dashboard/client/changes" className="dashboard-action">
            Solicitar cambio
          </Link>
          <Link href="/dashboard/client/chat" className="dashboard-action">
            Abrir conversacion con PM
          </Link>
        </div>
      </DashboardMutedCard>

      <DashboardCard>
        <SectionHeading eyebrow="Conversacion" title="Ultimos mensajes" description="Solo mostramos el contexto mas reciente del proyecto activo." />
        <div className="mt-6 grid gap-3">
          {recentMessages.map((message) => (
            <div key={message.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{message.senderName}</p>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{message.sentAt}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message.preview}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
