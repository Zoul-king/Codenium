"use client";

import { CheckCircle2, Clock, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardChrome, DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getMilestonePayment,
  getProjectMilestones,
  getSelectedOrPrimaryProject
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

export function PaymentsPanel() {
  const chrome = useDashboardChrome();
  const role = (chrome?.role === "pm" ? "pm" : "client") as "client" | "pm";
  const { state, markPaymentAsPaid } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, role);
  const milestones = getProjectMilestones(state, project?.id);

  if (!project) {
    return (
      <DashboardEmptyState
        title="Selecciona un proyecto"
        body="La vista de pagos depende del proyecto activo."
      />
    );
  }

  const linkedPayments = milestones
    .map((m) => ({ milestone: m, payment: getMilestonePayment(state, m.id) }))
    .filter((entry) => entry.payment);

  const totalDue = linkedPayments
    .filter((e) => e.payment!.status !== "paid")
    .reduce((s, e) => s + (e.payment!.amount ?? 0), 0);
  const totalPaid = linkedPayments
    .filter((e) => e.payment!.status === "paid")
    .reduce((s, e) => s + (e.payment!.amount ?? 0), 0);

  const isClient = role === "client";

  return (
    <div className="space-y-6">
      <header className={isClient ? "warm-card" : "rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]"}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#224a78)]">
              Pagos del proyecto
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              Cada pago se desbloquea cuando su hito está completado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-right">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pendiente</p>
              <p className="mt-1 text-xl font-bold text-warning-700">{formatCurrency(totalDue)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pagado</p>
              <p className="mt-1 text-xl font-bold text-success-700">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
      </header>

      {milestones.length === 0 ? (
        <DashboardEmptyState
          title="Sin hitos definidos"
          body="Cuando el PM publique los hitos podrás ver aquí los pagos asociados."
        />
      ) : (
        <ol className="space-y-3">
          {milestones.map((m) => {
            const payment = getMilestonePayment(state, m.id);
            const paymentState = resolvePaymentMilestoneState(m.status, payment?.status);
            return (
              <li
                key={m.id}
                className={cn(
                  "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
                  m.status === "current" && "border-[var(--role,#5e92c2)]/40"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{m.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatLongDate(m.date)}</p>
                  </div>
                  <PaymentBadge state={paymentState} />
                </div>

                {payment ? (
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]">
                        <CreditCard className="size-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{payment.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatCurrency(payment.amount)} · vence {formatLongDate(payment.dueDate)}
                        </p>
                      </div>
                    </div>
                    {paymentState.canPay && isClient ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <MercadoPagoButton paymentId={payment.id} amount={payment.amount} />
                        <Button
                          variant="outline"
                          onClick={() => {
                            markPaymentAsPaid(payment.id);
                            toast.success("¡Gracias! Marcamos tu pago como realizado.");
                          }}
                        >
                          <CheckCircle2 className="size-4" />
                          Confirmar pago manual
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    Este hito no tiene un pago asociado todavía.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function PaymentBadge({
  state
}: {
  state: ReturnType<typeof resolvePaymentMilestoneState>;
}) {
  const { tone, label } = state;
  const className =
    tone === "success"
      ? "badge-status-success"
      : tone === "warning"
        ? "badge-status-warning"
        : "badge-status-neutral";
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? Clock : Lock;
  return (
    <span className={className}>
      <Icon className="size-3" />
      {label}
    </span>
  );
}

function MercadoPagoButton({ paymentId, amount }: { paymentId: string; amount: number }) {
  // La integración con Mercado Pago está estructurada pero aún no operativa.
  // El botón se mantiene visible y deshabilitado: muestra un tooltip y, si se
  // fuerza un click, llama al stub /api/payments/mercadopago para confirmar la
  // ruta del lado del servidor.
  async function handleClick() {
    try {
      await fetch("/api/payments/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, amount })
      });
    } catch {
      // ignorar — la UI ya indica que está próximamente
    }
    toast.info("Mercado Pago aún no está habilitado", {
      description: "La integración estará disponible próximamente."
    });
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              className="bg-[#00B1EA] text-white hover:bg-[#0090c2] disabled:opacity-70"
              disabled
              aria-disabled="true"
              onClick={handleClick}
            >
              <CreditCard className="size-4" />
              Pagar con Mercado Pago
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Próximamente · integración en preparación
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

  return { label: "Pago bloqueado", tone: "neutral" as const, canPay: false };
}
