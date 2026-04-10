"use client";

import Link from "next/link";

import { DataRow, DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectPayments } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getPaymentStatusLabel } from "@/lib/presenters";

export function PaymentsPanel() {
  const { state } = useDashboardWorkspace();
  const project = getPrimaryProject(state, "client");
  const payments = getProjectPayments(state, project?.id);
  const completed = payments.filter((payment) => payment.status === "paid").length;
  const pending = payments.filter((payment) => payment.status !== "paid").length;

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Pagos" title={project?.name ?? "Sin proyecto"} />

        <div className="mt-8 grid gap-5">
          {payments.map((payment) => (
            <div key={payment.id} className="dashboard-gridline grid gap-3 pb-5 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-end">
              <div>
                <p className="text-lg font-semibold text-slate-950">{payment.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {getPaymentStatusLabel(payment.status)} · vence el {formatLongDate(payment.dueDate)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Estado" title="Flujo financiero" />
        <div className="mt-6">
          <DataRow label="Pagados" value={String(completed)} className="pt-0" />
          <DataRow label="Pendientes" value={String(pending)} />
          <DataRow label="Canal" value="Mercado Pago" />
          <DataRow label="Accion" value={<Link href="/contact" className="dashboard-link">Confirmar pago con administracion</Link>} className="border-b-0 pb-0" />
        </div>
      </DashboardCard>
    </div>
  );
}
