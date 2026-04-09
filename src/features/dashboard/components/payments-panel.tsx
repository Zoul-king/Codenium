import Link from "next/link";

import { DashboardCard, DashboardMutedCard, MetricPill, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectPayments } from "@/features/dashboard/lib/selectors";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getPaymentStatusLabel } from "@/lib/presenters";

export function PaymentsPanel() {
  const project = getPrimaryProject("client");
  const payments = getProjectPayments(project?.id);
  const nextPayment = payments.find((payment) => payment.status !== "paid");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Pagos" title="Estado financiero del proyecto" description="Mostramos lo pagado, lo siguiente y la accion principal sin ruido extra." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricPill label="Proyecto" value={project?.name ?? "Sin proyecto"} tone="accent" />
          <MetricPill label="Siguiente pago" value={nextPayment ? formatCurrency(nextPayment.amount) : "Sin pendientes"} />
        </div>
        {nextPayment ? (
          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">{nextPayment.label}</p>
                <p className="mt-1 text-sm text-slate-600">Vence el {formatLongDate(nextPayment.dueDate)}</p>
              </div>
              <StatusBadge tone={nextPayment.status === "pending" ? "warning" : "accent"}>{getPaymentStatusLabel(nextPayment.status)}</StatusBadge>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{formatCurrency(nextPayment.amount)}</p>
            <Link href="/contact" className="dashboard-button-primary mt-5 inline-flex">
              Confirmar pago con administracion
            </Link>
          </div>
        ) : null}
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Calendario" title="Plan de pagos visible" />
        <div className="mt-6 grid gap-3">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{payment.label}</p>
                <StatusBadge tone={payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "accent"}>{getPaymentStatusLabel(payment.status)}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{formatLongDate(payment.dueDate)}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(payment.amount)}</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
