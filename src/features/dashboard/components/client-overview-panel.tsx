"use client";

import Link from "next/link";

import { DashboardCard, DashboardMutedCard, MetricPill, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectPayments, getQuoteById, getUserById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, formatShortDate, getProjectStatusLabel, getPaymentStatusLabel } from "@/lib/presenters";

export function ClientOverviewPanel() {
  const { state } = useDashboardWorkspace();
  const project = getPrimaryProject(state, "client");
  const quote = getQuoteById(state, project?.quoteId);
  const pm = getUserById(state, project?.pmId);
  const payments = getProjectPayments(state, project?.id);
  const nextPayment = payments.find((payment) => payment.status !== "paid");

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <DashboardCard className="max-w-xl">
          <SectionHeading eyebrow="Panel de cliente" title="Todavia no tienes un proyecto activo" description="Cuando una cotizacion pase a ejecucion, aqui veras plan contratado, pagos, entregables y seguimiento con tu PM." />
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:grid-rows-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <DashboardCard className="xl:row-span-2">
        <SectionHeading eyebrow="Proyecto activo" title={project.name} description={project.summary} />
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <MetricPill label="Estado" value={getProjectStatusLabel(project.status)} tone="accent" />
          <MetricPill label="Progreso" value={`${project.progress}%`} />
          <MetricPill label="Plan contratado" value={project.planTitle} />
          <MetricPill label="PM asignado" value={pm?.name ?? "Pendiente"} />
        </div>
        <div className="mt-5">
          <ProgressBar value={project.progress} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Contrato visible</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{quote?.quoteKind === "formal" ? "Cotizacion formal" : "Precotizacion"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {project.planProfile === "business" ? "Perfil empresarial con entregables y pagos por etapas." : "Perfil personal con seguimiento centralizado y lectura clara del alcance."}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-500">{project.quoteCode}</p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Siguiente entrega</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatLongDate(project.dueDate)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">La fecha ya se conecta con hitos, pagos y entregables visibles dentro del mismo flujo.</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Pago relacionado" title={nextPayment ? nextPayment.label : "Sin pagos pendientes"} />
        {nextPayment ? (
          <div className="mt-6 rounded-[20px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">{formatCurrency(nextPayment.amount)}</p>
              <StatusBadge tone={nextPayment.status === "pending" ? "warning" : "accent"}>{getPaymentStatusLabel(nextPayment.status)}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Se desbloquea segun el avance confirmado por tu PM y mantiene trazabilidad con los hitos activos.</p>
            <p className="mt-3 text-sm font-medium text-slate-500">Vence el {formatShortDate(nextPayment.dueDate)}</p>
          </div>
        ) : null}
      </DashboardMutedCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Acciones rapidas" title="Siguiente paso visible" />
        <div className="mt-6 grid gap-3">
          <Link href="/dashboard/client/milestones" className="dashboard-action">
            Revisar hitos y cambios
          </Link>
          <Link href="/dashboard/client/deliverables" className="dashboard-action">
            Abrir entregables
          </Link>
          <Link href="/dashboard/client/chat" className="dashboard-action">
            Continuar con tu PM
          </Link>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
