import { getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { formatCurrency, getQuoteViability } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteEstimate } from "@/lib/types/domain";

interface QuoteSummaryCardProps {
  draft: QuoteDraft;
  estimate: QuoteEstimate;
  compact?: boolean;
}

export function QuoteSummaryCard({ draft, estimate, compact = false }: QuoteSummaryCardProps) {
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const featureModules = selectedModules.filter((item) => item.group === "feature");
  const serviceModules = selectedModules.filter((item) => item.group === "service");
  const viability = getQuoteViability(draft, estimate);
  const timelineLabel = draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : "8 a 12 meses";

  return (
    <aside className={compact ? "rounded-[24px] border border-slate-200 bg-slate-50 p-5" : "rounded-[24px] border border-white bg-gradient-to-br from-transparent to-white/80 p-5 shadow-[0_16px_30px_rgba(15,23,32,0.06)] lg:self-start"}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-600">Resumen del proyecto</p>

      <div className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_10px_18px_rgba(15,23,32,0.04)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-500">Estimado inicial</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-body-color">
            {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}
          </p>
          <p className="mt-2 text-sm leading-6 text-body-color/75">Un rango orientativo para ordenar alcance, prioridades y el siguiente paso.</p>
        </div>

        <div className="mt-5 space-y-4 border-t border-black/10 pt-4">
          <DetailItem label="Categoria" value={projectType?.label ?? "Sin definir"} />
          <DetailItem label="Objetivo" value={draft.objective.trim() || "Aun no escribes el objetivo del proyecto."} />
          <DetailItem label="Tiempo deseado" value={timelineLabel} />
          <DetailItem label="Tiempo del sistema" value={`${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} semanas`} />
          <DetailItem label="Capacidades" value={featureModules.length > 0 ? featureModules.map((item) => item.label).join(", ") : "Sin adicionales por ahora"} />
          <DetailItem label="Soporte posterior" value={serviceModules.length > 0 ? serviceModules.map((item) => item.label).join(", ") : "No incluido por ahora"} />
        </div>

        <div className="mt-5 border-t border-black/10 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-600">Lectura de viabilidad</p>
          <p className="mt-2 text-sm font-semibold text-body-color">{viability.label}</p>
          <p className="mt-2 text-sm leading-6 text-body-color/75">{viability.description}</p>
        </div>
      </div>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-body-color/45">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-body-color">{value}</p>
    </div>
  );
}
