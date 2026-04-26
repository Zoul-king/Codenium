"use client";

import { useMemo, useState } from "react";

import { DashboardCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { getPmStats, getPmUsers, getVisibleQuotes, getUserById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { sendDashboardNotification } from "@/lib/api/client";
import { formatLongDate, getQuoteStatusLabel } from "@/lib/utils/presenters";
import type { QuoteStatus } from "@/lib/types/domain";

export function AdminQuotePanel() {
  const { state, acceptQuote, setQuoteStatus } = useDashboardWorkspace();
  const pmUsers = getPmUsers(state);
  const quotes = getVisibleQuotes(state, "admin");
  const [assignment, setAssignment] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  const assignmentState = useMemo(
    () => ({
      ...Object.fromEntries(quotes.map((quote) => [quote.id, quote.pmId ?? ""])),
      ...assignment
    }),
    [assignment, quotes]
  );

  async function notifyQuoteStatus(quoteId: string, status: Exclude<QuoteStatus, "accepted">) {
    const quote = quotes.find((item) => item.id === quoteId);
    const client = quote ? getUserById(state, quote.clientId) : undefined;

    if (!quote || !client?.email) {
      throw new Error("No encontramos el correo del cliente para avisar el cambio de estado.");
    }

    await setQuoteStatus(quoteId, status);

    await sendDashboardNotification({
      type: "quote_status_update",
      recipientEmail: client.email,
      recipientName: client.name,
      quoteCode: quote.code,
      quoteTitle: quote.title,
      status
    });
  }

  return (
    <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
      <DashboardCard>
        <SectionHeading eyebrow="Cotizaciones" title="Entrada comercial" description="Administra el estado comercial y convierte cotizaciones aceptadas en proyectos activos." />
        <div className="mt-8 grid gap-6">
          {quotes.map((quote) => {
            const selectedPm = pmUsers.find((pm) => pm.id === assignmentState[quote.id]);
            const pmStats = selectedPm ? getPmStats(state, selectedPm.id) : null;

            return (
              <div key={quote.id} className="dashboard-gridline grid gap-5 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{quote.code}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{quote.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {quote.clientName} · {formatLongDate(quote.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{quote.quoteKind === "prequote" ? "Precotizacion" : "Cotizacion formal"}</p>
                    <div className="mt-2">
                      <StatusBadge tone={getStatusTone(quote.status)}>{getQuoteStatusLabel(quote.status)}</StatusBadge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCell label="Origen" value={quote.intakeSource === "service" ? "Servicio" : "Plan"} />
                  <InfoCell label="Seleccion" value={quote.selectionLabel} />
                  <InfoCell label="Perfil" value={quote.planProfile === "business" ? "Empresarial" : "Personal"} />
                  <InfoCell label="Estimado" value={`${formatCurrency(quote.estimate.build.min)} - ${formatCurrency(quote.estimate.build.max)}`} />
                </div>

                <div className="grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Asignar PM
                    <select
                      value={assignmentState[quote.id]}
                      onChange={(event) => setAssignment((current) => ({ ...current, [quote.id]: event.target.value }))}
                      className="dashboard-select"
                    >
                      <option value="">Selecciona un PM</option>
                      {pmUsers.map((pm) => {
                        const stats = getPmStats(state, pm.id);

                        return (
                          <option key={pm.id} value={pm.id}>
                            {pm.name} - {stats.activeProjects} activos / {stats.completedProjects} cerrados
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="dashboard-button-primary"
                      disabled={!assignmentState[quote.id]}
                      onClick={async () => {
                        try {
                          const pmId = assignmentState[quote.id];

                          if (!pmId) {
                            return;
                          }

                          await acceptQuote(quote.id, pmId);

                          const assignedPm = getUserById(state, pmId);
                          const client = getUserById(state, quote.clientId);

                          if (!assignedPm?.email || !client?.email) {
                            throw new Error("No encontramos los correos del cliente o del PM asignado.");
                          }

                          await sendDashboardNotification({
                            type: "quote_assignment",
                            quoteCode: quote.code,
                            quoteTitle: quote.title,
                            clientEmail: client.email,
                            clientName: client.name,
                            pmEmail: assignedPm.email,
                            pmName: assignedPm.name,
                            projectName: quote.title
                          });

                          setNotice("");
                        } catch (error) {
                          setNotice(error instanceof Error ? error.message : "No pudimos completar la conversion.");
                        }
                      }}
                    >
                      Convertir y aceptar
                    </button>
                    <button
                      type="button"
                      className="dashboard-button-secondary"
                      onClick={async () => {
                        try {
                          await notifyQuoteStatus(quote.id, "reviewed");
                          setNotice("");
                        } catch (error) {
                          setNotice(error instanceof Error ? error.message : "No pudimos notificar la revision.");
                        }
                      }}
                    >
                      Marcar revisada
                    </button>
                    <button
                      type="button"
                      className="dashboard-button-secondary"
                      onClick={async () => {
                        try {
                          await notifyQuoteStatus(quote.id, "rejected");
                          setNotice("");
                        } catch (error) {
                          setNotice(error instanceof Error ? error.message : "No pudimos notificar el rechazo.");
                        }
                      }}
                    >
                      Rechazar
                    </button>
                    <button
                      type="button"
                      className="dashboard-button-secondary"
                      onClick={async () => {
                        try {
                          await notifyQuoteStatus(quote.id, "pending");
                          setNotice("");
                        } catch (error) {
                          setNotice(error instanceof Error ? error.message : "No pudimos regresar la cotizacion a pendiente.");
                        }
                      }}
                    >
                      Volver a pendiente
                    </button>
                  </div>
                </div>

                {pmStats ? <p className="text-sm text-slate-500">{selectedPm?.name} lleva {pmStats.activeProjects} activos y {pmStats.completedProjects} cerrados.</p> : null}
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Asignacion" title="Capacidad visible" />
        {notice ? <p className="mt-4 text-sm font-medium text-rose-600">{notice}</p> : null}
        <div className="mt-6 grid gap-4">
          {pmUsers.map((pm) => {
            const stats = getPmStats(state, pm.id);

            return (
              <div key={pm.id} className="dashboard-gridline grid gap-2 pb-4">
                <p className="font-semibold text-slate-950">{pm.name}</p>
                <p className="text-sm text-slate-600">{stats.activeProjects} activos · {stats.completedProjects} cerrados</p>
              </div>
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{value}</p>
    </div>
  );
}

function getStatusTone(status: QuoteStatus) {
  if (status === "accepted") return "success";
  if (status === "reviewed") return "accent";
  if (status === "rejected") return "danger";
  return "warning";
}
