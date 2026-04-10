"use client";

import Link from "next/link";

import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectDocuments, getProjectPayments, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");
  const activeProject = getPrimaryProject(state, "client");
  const documents = getProjectDocuments(state, activeProject?.id).filter((document) => document.audience !== "admin" && document.audience !== "pm");
  const pendingPayments = getProjectPayments(state, activeProject?.id).filter((payment) => payment.status !== "paid").length;

  if (projects.length === 0) {
    return (
      <DashboardCard className="max-w-3xl">
        <SectionHeading eyebrow="Resumen" title="Todavia no tienes proyectos activos" description="Cuando una cotizacion avance a proyecto, aqui veras su estado, pagos y entregables." />
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
      <div className="grid gap-6">
        <DashboardCard>
          <SectionHeading eyebrow="Vista general" title={activeProject?.name ?? "Proyecto activo"} description="Una lectura simple del estado actual, lo que sigue y los pendientes visibles." />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryMetric label="Estado" value={activeProject ? getProjectStatusLabel(activeProject.status) : "-"} helper={activeProject?.selectionLabel ?? "Sin seleccion"} />
            <SummaryMetric label="Avance" value={`${activeProject?.progress ?? 0}%`} helper={activeProject ? `Entrega estimada ${formatShortDate(activeProject.dueDate)}` : "Sin fecha"} />
            <SummaryMetric label="Pendientes" value={String(pendingPayments)} helper={pendingPayments > 0 ? "Pagos por confirmar" : "Sin pagos abiertos"} />
          </div>

          {activeProject ? (
            <div className="mt-8 rounded-[24px] border border-slate-200 bg-[#f7fbfc] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Proyecto principal</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{activeProject.name}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{activeProject.summary}</p>
                </div>
                <StatusBadge tone={activeProject.status === "done" ? "success" : "accent"}>{getProjectStatusLabel(activeProject.status)}</StatusBadge>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Progreso actual</span>
                  <span>{activeProject.progress}%</span>
                </div>
                <ProgressBar value={activeProject.progress} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dashboard/client/milestones" className="dashboard-button-primary">
                  Ver hitos
                </Link>
                <Link href="/dashboard/client/deliverables" className="dashboard-button-secondary">
                  Abrir entregables
                </Link>
              </div>
            </div>
          ) : null}
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Todos tus proyectos" title="Seguimiento por frente" />
          <div className="mt-6 grid gap-4">
            {projects.map((project) => (
              <article key={project.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{project.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{project.summary}</p>
                  </div>
                  <StatusBadge tone={project.status === "done" ? "success" : "neutral"}>{getProjectStatusLabel(project.status)}</StatusBadge>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>Avance</span>
                      <span>{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 lg:text-right">
                    <p>{project.intakeSource === "service" ? "Servicio" : "Plan"}: {project.selectionLabel}</p>
                    <p>Entrega estimada: {formatShortDate(project.dueDate)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </DashboardMutedCard>
      </div>

      <div className="grid h-fit gap-6 xl:sticky xl:top-6">
        <DashboardCard>
          <SectionHeading eyebrow="Proximo paso" title="Lo importante hoy" />
          <div className="mt-6 grid gap-4">
            <ActionRow title="Revisar hitos y cambios" body="Consulta la etapa actual y registra ajustes puntuales para el PM." href="/dashboard/client/milestones" />
            <ActionRow title="Confirmar pagos" body="Mantiene visible cualquier pendiente abierto con administracion." href="/dashboard/client/payments" />
            <ActionRow title="Abrir entregables" body={`Tienes ${documents.length} documentos visibles en este momento.`} href="/dashboard/client/deliverables" />
          </div>
        </DashboardCard>

        <DashboardMutedCard>
          <SectionHeading eyebrow="Contacto" title="Canales del proyecto" />
          <p className="mt-4 text-sm leading-7 text-slate-600">Usa el chat interno para mantener el contexto dentro del proyecto y evita perder seguimiento por fuera.</p>
          <Link href="/dashboard/client/chat" className="dashboard-button-secondary mt-5 w-full justify-center">
            Ir al chat con PM
          </Link>
        </DashboardMutedCard>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

function ActionRow({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="rounded-[20px] border border-slate-200 bg-white p-4 transition hover:border-primary-200 hover:bg-primary-50/40">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </Link>
  );
}
