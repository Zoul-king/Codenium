"use client";

import Link from "next/link";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectPayments } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getPaymentStatusLabel } from "@/lib/presenters";

export function PaymentsPanel() {
  const { state } = useDashboardWorkspace();
  const project = getPrimaryProject(state, "client");
  const payments = getProjectPayments(state, project?.id);
  const completed = payments.filter((payment) => payment.status === "paid");
  const pending = payments.filter((payment) => payment.status !== "paid");

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <DashboardCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Pagos" title={project?.name ?? "Sin proyecto"} description="Los pagos se habilitan segun el avance que el PM confirma en hitos." />
        </div>

        <div className="mt-6 grid gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="grid gap-4 border-b border-slate-100 pb-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-slate-950">{payment.label}</p>
                  <StatusBadge tone={payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "neutral"}>
                    {getPaymentStatusLabel(payment.status)}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm text-slate-600">Vence el {formatLongDate(payment.dueDate)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardMutedCard className="flex min-h-0 flex-col">
        <div className="border-b border-slate-200 pb-5">
          <SectionHeading eyebrow="Resumen" title="Estado del flujo financiero" />
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pagos completados</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{completed.length}</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pendientes o programados</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{pending.length}</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-5">
            <p className="text-sm leading-7 text-slate-600">
              Si un hito sigue en curso, el pago relacionado permanece bloqueado o pendiente hasta que el PM lo marque como finalizado.
            </p>
          </div>
          <Link href="/contact" className="dashboard-button-primary w-fit">
            Confirmar pago con administracion
          </Link>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
