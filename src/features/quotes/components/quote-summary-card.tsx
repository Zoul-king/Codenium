import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteEstimate } from "@/lib/types/domain";

import { formatCurrency } from "@/features/quotes/lib/estimate";

interface QuoteSummaryCardProps {
  draft: QuoteDraft;
  estimate: QuoteEstimate;
}

export function QuoteSummaryCard({ draft, estimate }: QuoteSummaryCardProps) {
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const selectedModules = quoteModules.filter((item) => draft.modules.includes(item.key));

  return (
    <article className="rounded-[24px] border border-white bg-gradient-to-br from-transparent to-white/80 p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
      <div className="mb-6 flex flex-col gap-2">
        <span className="type-kicker">Pre cotizacion</span>
        <h3 className="text-2xl font-bold leading-8 text-body-color">{projectType?.label}</h3>
        <p className="type-body">
          Este estimado es inicial y sirve para alinear alcance, prioridad y complejidad antes de una propuesta formal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[18px] bg-primary-50 p-4">
          <span className="mb-2 block text-sm font-semibold text-primary-500">Build estimado</span>
          <strong className="block text-xl text-body-color">
            {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}
          </strong>
        </div>
        <div className="rounded-[18px] bg-foreground p-4">
          <span className="mb-2 block text-sm font-semibold text-primary-500">Tiempo estimado</span>
          <strong className="block text-xl text-body-color">
            {estimate.timelineWeeks.min} - {estimate.timelineWeeks.max} semanas
          </strong>
        </div>
        <div className="rounded-[18px] bg-foreground p-4">
          <span className="mb-2 block text-sm font-semibold text-primary-500">Mantenimiento mensual</span>
          <strong className="block text-xl text-body-color">
            {estimate.monthly.max > 0
              ? `${formatCurrency(estimate.monthly.min)} - ${formatCurrency(estimate.monthly.max)}`
              : "Opcional"}
          </strong>
        </div>
      </div>

      <div className="mt-6">
        <span className="mb-3 block text-sm font-semibold text-primary-500">Modulos seleccionados</span>
        <div className="flex flex-wrap gap-2">
          {selectedModules.length > 0 ? (
            selectedModules.map((item) => (
              <span key={item.key} className="tag">
                {item.label}
              </span>
            ))
          ) : (
            <span className="type-body">Sin modulos extra por ahora.</span>
          )}
        </div>
      </div>
    </article>
  );
}
