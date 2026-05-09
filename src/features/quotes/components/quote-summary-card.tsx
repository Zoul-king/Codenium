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

  return (
    <aside className={compact ? "rounded-[24px] border border-slate-200 bg-slate-50 p-5" : "quote-sticky quote-panel"}>
      <div className="dashboard-gridline">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-500">Resumen</p>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-body-color">
          {estimate.build.max > 0 ? `${formatCurrency(estimate.build.min)} - ${formatCurrency(estimate.build.max)}` : "Pendiente"}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
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
    <div className="grid gap-1 border-b border-slate-200 pb-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-body-color/45">{label}</p>
      <p className={isPending ? "text-sm font-medium text-slate-500" : "text-sm font-semibold leading-6 text-body-color"}>{value}</p>
    </div>
  );
}
