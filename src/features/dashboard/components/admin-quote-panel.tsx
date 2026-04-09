"use client";

import { useMemo, useState } from "react";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPmStats, getPmUsers } from "@/features/dashboard/lib/selectors";
import { mockProjects, mockQuotes } from "@/lib/mocks";
import { formatLongDate, getQuoteStatusLabel } from "@/lib/presenters";
import { formatCurrency } from "@/features/quotes/lib/estimate";

type QuoteActionState = {
  status: "idle" | "editing" | "accepted";
  pmId: string;
};

export function AdminQuotePanel() {
  const pmUsers = getPmUsers();
  const [states, setStates] = useState<Record<string, QuoteActionState>>(
    Object.fromEntries(mockQuotes.map((quote) => [quote.id, { status: "idle", pmId: quote.pmId ?? "" }]))
  );

  const openQuotes = useMemo(() => mockQuotes.filter((quote) => quote.status !== "approved"), []);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Cotizaciones" title="Aprobacion con asignacion obligatoria" description="Aceptar una cotizacion ahora exige definir PM y deja visible su capacidad actual antes de confirmar." />
        <div className="mt-6 grid gap-4">
          {openQuotes.map((quote) => {
            const localState = states[quote.id];
            const selectedPm = pmUsers.find((pm) => pm.id === localState.pmId);
            const pmStats = selectedPm ? getPmStats(selectedPm.id) : null;

            return (
              <div key={quote.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{quote.code}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{quote.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{quote.clientName} - {formatLongDate(quote.createdAt)}</p>
                  </div>
                  <StatusBadge tone={quote.status === "review" ? "warning" : "accent"}>{getQuoteStatusLabel(quote.status)}</StatusBadge>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Estimado</p>
                    <p className="mt-2 font-semibold text-slate-950">{formatCurrency(quote.estimate.build.min)} - {formatCurrency(quote.estimate.build.max)}</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Tiempo</p>
                    <p className="mt-2 font-semibold text-slate-950">{quote.estimate.timelineWeeks.min} - {quote.estimate.timelineWeeks.max} semanas</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">PM sugerido</p>
                    <p className="mt-2 font-semibold text-slate-950">{selectedPm?.name ?? "Seleccionar PM"}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Asignar PM antes de aceptar
                    <select
                      value={localState.pmId}
                      onChange={(event) =>
                        setStates((current) => ({
                          ...current,
                          [quote.id]: { ...current[quote.id], pmId: event.target.value }
                        }))
                      }
                      className="dashboard-select"
                    >
                      <option value="">Selecciona un PM</option>
                      {pmUsers.map((pm) => {
                        const stats = getPmStats(pm.id);

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
                      disabled={!localState.pmId}
                      onClick={() =>
                        setStates((current) => ({
                          ...current,
                          [quote.id]: { ...current[quote.id], status: "accepted" }
                        }))
                      }
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      className="dashboard-button-secondary"
                      onClick={() =>
                        setStates((current) => ({
                          ...current,
                          [quote.id]: { ...current[quote.id], status: "editing" }
                        }))
                      }
                    >
                      Modificar
                    </button>
                  </div>
                </div>

                {localState.status === "accepted" && pmStats ? (
                  <div className="mt-4 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-700">
                    Se preparara la conversion a proyecto con {selectedPm?.name}. Ese PM tiene {pmStats.activeProjects} activos y {pmStats.completedProjects} completados.
                  </div>
                ) : null}

                {localState.status === "editing" ? (
                  <div className="mt-4 rounded-[18px] border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-slate-700">
                    La cotizacion queda en revision para ajustar alcance, tiempos o modulos antes de reenviar.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Contexto" title="Capacidad y proyectos relacionados" />
        <div className="mt-6 grid gap-4">
          {pmUsers.map((pm) => {
            const stats = getPmStats(pm.id);
            const relatedProjects = mockProjects.filter((project) => project.pmId === pm.id);

            return (
              <div key={pm.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">{pm.name}</p>
                  <StatusBadge tone={stats.activeProjects >= 2 ? "warning" : "success"}>{stats.activeProjects >= 2 ? "Carga alta" : "Disponible"}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{stats.activeProjects} activos y {stats.completedProjects} completados.</p>
                <div className="mt-4 grid gap-2">
                  {relatedProjects.map((project) => (
                    <div key={project.id} className="rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                      {project.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
