import { getInfrastructureLabel, getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { formatCurrency, getQuoteViability } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/mocks";
import type { QuoteSelection } from "@/lib/quote-selection";
import type { QuoteDraft, QuoteEstimate } from "@/lib/types/domain";

interface QuoteSummaryCardProps {
  draft: QuoteDraft;
  estimate: QuoteEstimate;
  selection: QuoteSelection | null;
  compact?: boolean;
}

export function QuoteSummaryCard({ draft, estimate, selection, compact = false }: QuoteSummaryCardProps) {
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const featureModules = selectedModules.filter((item) => item.group === "feature");
  const serviceModules = selectedModules.filter((item) => item.group === "service");
  const viability = getQuoteViability(draft, estimate);
  const timelineLabel = draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : "8 a 12 meses";
  const selectionLabel = selection?.source === "service" ? "Servicio seleccionado" : "Plan seleccionado";
  const selectedValue = selection?.label ?? "Pendiente";

  return (
    <aside className={compact ? "rounded-[24px] border border-slate-200 bg-slate-50 p-5" : "quote-sticky quote-panel"}>
      <div className="border-b border-slate-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-600">Resumen del proyecto</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-500">Estimado inicial</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-body-color">
              {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-900">
              {selectionLabel}: <span className="text-primary-600">{selectedValue}</span>
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">{viability.label}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5">
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem label={selection?.source === "service" ? "Servicio escogido" : "Plan escogido"} value={selectedValue} />
          <DetailItem label="Categoria" value={projectType?.label ?? "Pendiente"} />
          <DetailItem label="Tiempo deseado" value={timelineLabel} />
          <DetailItem label="Infraestructura" value={getInfrastructureLabel(draft.infrastructure)} />
          <DetailItem label="Soporte posterior" value={serviceModules.length > 0 ? serviceModules.map((item) => item.label).join(", ") : "Pendiente"} />
        </div>

        <div className="grid gap-3 border-t border-slate-200 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-body-color/45">Objetivo</p>
          <p className="text-sm leading-6 text-body-color">{draft.objective.trim() || "Pendiente"}</p>
        </div>

        <div className="grid gap-3 border-t border-slate-200 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-body-color/45">Capacidades</p>
          {featureModules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {featureModules.map((item) => (
                <span key={item.key} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {item.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Pendiente</p>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-600">Lectura de viabilidad</p>
          <p className="mt-2 text-sm leading-6 text-body-color/75">{viability.description}</p>
        </div>
      </div>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-body-color/45">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-body-color">{value}</p>
    </div>
  );
}
