"use client";

import { CheckCircle2, Clock, MoreHorizontal, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjectById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import type { PaymentRecord, PaymentStatus } from "@/lib/types/domain";
import { formatShortDate, getPaymentStatusLabel } from "@/lib/utils/presenters";

const TODAY = new Date("2026-04-10T12:00:00").getTime();
const DAY = 1000 * 60 * 60 * 24;

export function AdminPaymentsPanel() {
  const { state, markPaymentAsPaid } = useDashboardWorkspace();
  const payments = state.payments;

  const totals = useMemo(() => {
    const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    const scheduled = payments.filter((p) => p.status === "scheduled").reduce((s, p) => s + p.amount, 0);
    const overdue = payments
      .filter((p) => p.status !== "paid" && new Date(`${p.dueDate}T12:00:00`).getTime() < TODAY)
      .reduce((s, p) => s + p.amount, 0);
    return { collected, pending, scheduled, overdue };
  }, [payments]);

  function markPaid(payment: PaymentRecord) {
    markPaymentAsPaid(payment.id);
    toast.success("Pago marcado como cobrado");
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#3f237a)]">
              Finanzas
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">Pagos</h1>
            <p className="mt-1 text-sm text-slate-600">Vista consolidada de cobros y vencimientos.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
          <KpiCard label="Cobrado" value={formatCurrency(totals.collected)} icon={<TrendingUp className="size-4" />} tone="success" />
          <KpiCard label="Pendiente" value={formatCurrency(totals.pending)} icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="Programado" value={formatCurrency(totals.scheduled)} icon={<Wallet className="size-4" />} tone="info" />
          <KpiCard label="Vencido" value={formatCurrency(totals.overdue)} icon={<Clock className="size-4" />} tone="error" />
        </div>
      </header>

      <Tabs defaultValue="pending">
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="pending">Pendientes ({payments.filter((p) => p.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="scheduled">Programados ({payments.filter((p) => p.status === "scheduled").length})</TabsTrigger>
          <TabsTrigger value="paid">Cobrados ({payments.filter((p) => p.status === "paid").length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({payments.length})</TabsTrigger>
        </TabsList>

        {(["pending", "scheduled", "paid", "all"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <PaymentsTable
              payments={tab === "all" ? payments : payments.filter((p) => p.status === (tab as PaymentStatus))}
              state={state}
              onMarkPaid={markPaid}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function PaymentsTable({
  payments,
  state,
  onMarkPaid
}: {
  payments: PaymentRecord[];
  state: ReturnType<typeof useDashboardWorkspace>["state"];
  onMarkPaid: (p: PaymentRecord) => void;
}) {
  return (
    <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white shadow-[var(--shadow-card-dense)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pago</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Vence</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const project = getProjectById(state, payment.projectId);
            const isOverdue =
              payment.status !== "paid" &&
              new Date(`${payment.dueDate}T12:00:00`).getTime() < TODAY;
            const daysToDue = Math.ceil(
              (new Date(`${payment.dueDate}T12:00:00`).getTime() - TODAY) / DAY
            );
            return (
              <TableRow key={payment.id}>
                <TableCell>
                  <p className="font-medium text-slate-950">{payment.label}</p>
                </TableCell>
                <TableCell className="text-sm text-slate-700">{project?.name ?? "—"}</TableCell>
                <TableCell className="font-semibold text-slate-950">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-slate-700">{formatShortDate(payment.dueDate)}</p>
                    {isOverdue ? (
                      <p className="text-[10px] font-semibold text-error-600">{Math.abs(daysToDue)}d vencido</p>
                    ) : payment.status !== "paid" ? (
                      <p className="text-[10px] text-slate-500">en {daysToDue}d</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} overdue={isOverdue} />
                </TableCell>
                <TableCell>
                  {payment.status === "pending" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onMarkPaid(payment)}>
                          <CheckCircle2 className="size-4" />
                          Marcar cobrado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                Sin pagos en esta categoría.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "success" | "warning" | "info" | "error";
}) {
  const toneClass = {
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-700",
    info: "bg-info-50 text-info-700",
    error: "bg-error-50 text-error-700"
  }[tone];

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="kpi-label">{label}</span>
        <span className={`grid size-7 place-items-center rounded-full ${toneClass}`}>{icon}</span>
      </div>
      <p className="mt-3 text-xl font-bold tracking-[-0.03em] text-slate-950">{value}</p>
    </div>
  );
}

function PaymentStatusBadge({ status, overdue }: { status: PaymentStatus; overdue?: boolean }) {
  if (overdue) {
    return <span className="badge-status-error">Vencido</span>;
  }
  const cls = {
    paid: "badge-status-success",
    pending: "badge-status-warning",
    scheduled: "badge-status-info"
  }[status];
  return <span className={cls}>{getPaymentStatusLabel(status)}</span>;
}

void Badge;
