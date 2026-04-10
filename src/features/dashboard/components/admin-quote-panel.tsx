"use client";

import { useState } from "react";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPmStats, getPmUsers, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { formatLongDate, getQuoteStatusLabel } from "@/lib/presenters";

export function AdminQuotePanel() {
  const { state, acceptQuote, setQuoteStatus } = useDashboardWorkspace();
  const pmUsers = getPmUsers(state);
  const quotes = getVisibleQuotes(state, "admin");
  const [assignment, setAssignment] = useState<Record<string, string>>(
    Object.fromEntries(quotes.map((quote) => [quote.id, quote.pmId ?? ""]))
  );

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Cotizaciones" title="Precotizaciones y conversion formal" description="Aceptar una precotizacion la convierte en cotizacion formal y crea el proyecto visible para el resto del sistema." />
        <div className="mt-6 grid gap-4">
          {quotes.map((quote) => {
            const selectedPm = pmUsers.find((pm) => pm.id === assignment[quote.id]);
            const pmStats = selectedPm ? getPmStats(state, selectedPm.id) : null;

            return (
              <div key={quote.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{quote.code}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{quote.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{quote.clientName} - {formatLongDate(quote.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge tone={quote.quoteKind === "prequote" ? "warning" : "accent"}>
                      {quote.quoteKind === "prequote" ? "Precotizacion" : "Cotizacion formal"}
                    </StatusBadge>
                    <StatusBadge tone={quote.status === "approved" ? "success" : quote.status === "review" ? "warning" : "accent"}>{getQuoteStatusLabel(quote.status)}</StatusBadge>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <InfoCell label="Perfil" value={quote.planProfile === "business" ? "Empresarial" : "Personal"} />
                  <InfoCell label="Plan" value={quote.planTitle} />
                  <InfoCell label="Estimado" value={`${formatCurrency(quote.estimate.build.min)} - ${formatCurrency(quote.estimate.build.max)}`} />
                  <InfoCell label="Infraestructura" value={quote.infrastructure} />
                </div>

                <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Asignar PM
                    <select
                      value={assignment[quote.id]}
                      onChange={(event) => setAssignment((current) => ({ ...current, [quote.id]: event.target.value }))}
                      className="dashboard-select"
                    >
                      <option value="">Selecciona un PM</option>
                      {pmUsers.map((pm) => {
                        const stats = getPmStats(state, pm.id);

                        return (
                          <option key={pm.id} value={pm.id}>
                            {pm.name} - {stats.activeProjects} activos / {stats.completedProjects} completados
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="dashboard-button-primary"
                      disabled={!assignment[quote.id]}
                      onClick={() => acceptQuote(quote.id, assignment[quote.id])}
                    >
                      Convertir y aceptar
                    </button>
                    <button type="button" className="dashboard-button-secondary" onClick={() => setQuoteStatus(quote.id, "review")}>
                      En revision
                    </button>
                  </div>
                </div>

                {pmStats ? (
                  <div className="mt-4 rounded-[18px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                    {selectedPm?.name} tiene {pmStats.activeProjects} proyectos activos y {pmStats.completedProjects} completados.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Contexto" title="Asignaciones visibles" />
        <div className="mt-6 grid gap-4">
          {pmUsers.map((pm) => {
            const stats = getPmStats(state, pm.id);

            return (
              <div key={pm.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">{pm.name}</p>
                  <StatusBadge tone={stats.activeProjects >= 2 ? "warning" : "success"}>{stats.activeProjects >= 2 ? "Carga alta" : "Disponible"}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{stats.activeProjects} activos y {stats.completedProjects} completados.</p>
              </div>
            );
          })}
        </div>
      </DashboardMutedCard>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
