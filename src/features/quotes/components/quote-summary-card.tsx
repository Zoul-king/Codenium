import { getInfrastructureLabel, getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/config/catalogs";
import type { QuoteSelection } from "@/features/quotes/lib/quote-selection";
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
  const timelineLabel = draft.timelinePreference === "1-4" ? "de 1 a 4 meses" : draft.timelinePreference === "5-7" ? "de 5 a 7 meses" : draft.timelinePreference === "8-12" ? "de 8 a 12 meses" : "Pendiente";
  const compactList = featureModules.length > 0 ? featureModules.map((item) => item.label).join(", ") : "Pendiente";

  const hasEstimate = estimate.build.max > 0;

  return (
    <aside className={compact ? "rounded-[20px] border border-slate-200 bg-slate-50 p-5" : "quote-summary"}>
      <div className="quote-summary__header">
        <span className="quote-summary__kicker">Resumen de la precotizacion</span>
        <p className="quote-summary__price">
          {hasEstimate ? `${formatCurrency(estimate.build.min)} - ${formatCurrency(estimate.build.max)}` : "Pendiente"}
        </p>
        {hasEstimate ? <p className="quote-summary__currency">Pesos mexicanos · rango referencial</p> : null}
      </div>

      <div className="quote-summary__list">
        <SummaryRow label="Plan seleccionado" value={selection?.source === "plan" ? selection.label : "Pendiente"} />
        <SummaryRow label="Categoria" value={projectType?.label ?? "Pendiente"} />
        <SummaryRow label="Objetivo" value={draft.objective.trim() || "Pendiente"} />
        <SummaryRow label="Infraestructura" value={draft.infrastructure ? getInfrastructureLabel(draft.infrastructure) : "Pendiente"} />
        <SummaryRow label="Tiempo aproximado" value={timelineLabel} />
        <SummaryRow label="Capacidades complementarias" value={compactList} />
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const isPending = value === "Pendiente";

  return (
    <div className="quote-summary__row">
      <p className="quote-summary__label">{label}</p>
      <p className={isPending ? "quote-summary__value quote-summary__value--pending" : "quote-summary__value"}>{value}</p>
    </div>
  );
}
