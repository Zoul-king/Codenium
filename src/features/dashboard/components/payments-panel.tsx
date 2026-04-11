"use client";

import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getMilestonePayment, getProjectMilestones, getSelectedProject } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate } from "@/lib/presenters";

export function PaymentsPanel() {
  const { state, markPaymentAsPaid } = useDashboardWorkspace();
  const project = getSelectedProject(state, "client");
  const milestones = getProjectMilestones(state, project?.id);

  if (!project) {
    return (
      <DashboardCard>
        <DashboardEmptyState title="Selecciona un proyecto" body="La vista de pagos depende del proyecto activo que elijas en la seccion Proyectos." />
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_320px]">
      <DashboardCard>
        <SectionHeading title="Pagos por hito" description="Cada pago se habilita segun el estado real del hito correspondiente." />

        <div className="mt-5 grid gap-3">
          {milestones.map((milestone) => {
            const payment = getMilestonePayment(state, milestone.id);
            const paymentState = resolvePaymentMilestoneState(milestone.status, payment?.status);

            return (
              <article key={milestone.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{milestone.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                    <p className="mt-3 text-xs font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "neutral"}>
                      {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En proceso" : "Pendiente"}
                    </StatusBadge>
                    <StatusBadge tone={paymentState.tone}>{paymentState.label}</StatusBadge>
                  </div>
                </div>

                {payment ? (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{payment.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatCurrency(payment.amount)} · vence el {formatLongDate(payment.dueDate)}</p>
                    </div>
                    {paymentState.canPay ? (
                      <button type="button" className="dashboard-button-primary" onClick={() => markPaymentAsPaid(payment.id)}>
                        Marcar pago realizado
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500">Este hito no tiene un pago asociado todavia.</p>
                )}
              </article>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
        <SectionHeading title="Reglas de pago" />
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
            <p className="font-semibold text-slate-900">Pago inhabilitado</p>
            <p className="mt-1 leading-6">El hito sigue en proceso o pendiente. Aun no corresponde liberar el pago.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
            <p className="font-semibold text-slate-900">Pago en espera</p>
            <p className="mt-1 leading-6">El hito ya se completo y el pago queda listo para registrarse.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
            <p className="font-semibold text-slate-900">Pago realizado</p>
            <p className="mt-1 leading-6">El estado ya se refleja tambien para el PM y para administracion.</p>
          </div>
        </div>
      </DashboardMutedCard>
    </div>
  );
}

export function resolvePaymentMilestoneState(
  milestoneStatus: "done" | "current" | "next",
  paymentStatus?: "paid" | "pending" | "scheduled"
) {
  if (paymentStatus === "paid") {
    return { label: "Pago realizado", tone: "success" as const, canPay: false };
  }

  if (milestoneStatus === "done") {
    return { label: "Pago en espera", tone: "warning" as const, canPay: true };
  }

  return { label: "Pago inhabilitado", tone: "neutral" as const, canPay: false };
}
