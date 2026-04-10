"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getProjectById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getPaymentStatusLabel } from "@/lib/presenters";

export function AdminPaymentsPanel() {
  const { state, markPaymentAsPaid } = useDashboardWorkspace();
  const pending = state.payments.filter((payment) => payment.status !== "paid");
  const accepted = state.payments.filter((payment) => payment.status === "paid");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Pagos" title="Pendientes y aceptados" description="Administracion ve los pagos ligados a proyectos y puede marcarlos como aceptados para reflejar el cambio en cliente." />
        <div className="mt-6 grid gap-4">
          {pending.map((payment) => {
            const project = getProjectById(state, payment.projectId);

            return (
              <div key={payment.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{payment.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{project?.name ?? "Sin proyecto"} · {project?.planTitle ?? "Sin plan"}</p>
                  </div>
                  <StatusBadge tone={payment.status === "pending" ? "warning" : "accent"}>{getPaymentStatusLabel(payment.status)}</StatusBadge>
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{formatCurrency(payment.amount)}</p>
                <p className="mt-2 text-sm text-slate-600">Vence el {formatLongDate(payment.dueDate)}</p>
                {payment.status === "pending" ? (
                  <button type="button" className="dashboard-button-primary mt-5" onClick={() => markPaymentAsPaid(payment.id)}>
                    Marcar aceptado
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Aceptados" title="Historial reciente" />
        <div className="mt-6 grid gap-3">
          {accepted.map((payment) => {
            const project = getProjectById(state, payment.projectId);

            return (
              <div key={payment.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{payment.label}</p>
                  <StatusBadge tone="success">Pagado</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{project?.name ?? "Sin proyecto"}</p>
                <p className="mt-2 text-sm font-medium text-slate-500">{formatCurrency(payment.amount)}</p>
              </div>
            );
          })}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
