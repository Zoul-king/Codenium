"use client";

import { DashboardCard, SectionHeading } from "@/features/dashboard/components/primitives";
import { getProjectById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getPaymentStatusLabel } from "@/lib/utils/presenters";

export function AdminPaymentsPanel() {
  const { state, markPaymentAsPaid } = useDashboardWorkspace();
  const pending = state.payments.filter((payment) => payment.status !== "paid");
  const accepted = state.payments.filter((payment) => payment.status === "paid");

  return (
    <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1.08fr)_340px]">
      <DashboardCard>
        <SectionHeading eyebrow="Pagos" title="Pendientes y programados" />
        <div className="mt-8 grid gap-5">
          {pending.map((payment) => {
            const project = getProjectById(state, payment.projectId);

            return (
              <div key={payment.id} className="dashboard-gridline grid gap-3 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{payment.label}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project?.name ?? "Sin proyecto"} · {project?.selectionLabel ?? "Sin seleccion"}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{getPaymentStatusLabel(payment.status)}</p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{formatCurrency(payment.amount)}</p>
                    <p className="mt-2 text-sm text-slate-600">Vence el {formatLongDate(payment.dueDate)}</p>
                  </div>
                  {payment.status === "pending" ? (
                    <button type="button" className="dashboard-button-primary" onClick={() => markPaymentAsPaid(payment.id)}>
                      Marcar aceptado
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Historial" title="Pagos registrados" />
        <div className="mt-6 grid gap-4">
          {accepted.map((payment) => {
            const project = getProjectById(state, payment.projectId);

            return (
              <div key={payment.id} className="dashboard-gridline grid gap-2 pb-4">
                <p className="font-semibold text-slate-950">{payment.label}</p>
                <p className="text-sm text-slate-600">{project?.name ?? "Sin proyecto"}</p>
                <p className="text-sm text-slate-500">{formatCurrency(payment.amount)}</p>
              </div>
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}
