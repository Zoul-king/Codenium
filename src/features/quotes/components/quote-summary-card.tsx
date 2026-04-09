import { getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteEstimate } from "@/lib/types/domain";

interface QuoteSummaryCardProps {
  draft: QuoteDraft;
  estimate: QuoteEstimate;
}

export function QuoteSummaryCard({ draft, estimate }: QuoteSummaryCardProps) {
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const featureModules = selectedModules.filter((item) => item.group === "feature");
  const serviceModules = selectedModules.filter((item) => item.group === "service");

  return (
    <article className="rounded-[24px] border border-white bg-gradient-to-br from-transparent to-white/80 p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
      <div className="mb-6 flex flex-col gap-2">
        <span className="type-kicker">Estimado inicial</span>
        <h3 className="text-2xl font-bold leading-8 text-body-color">{projectType?.label}</h3>
        <p className="type-body">
          Esta pre cotización te da un rango orientativo para conversar con claridad sobre alcance, tiempos y prioridades antes de una propuesta formal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[18px] bg-primary-50 p-4">
          <span className="mb-2 block text-sm font-semibold text-primary-500">Inversión estimada</span>
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
          <span className="mb-2 block text-sm font-semibold text-primary-500">Acompañamiento mensual</span>
          <strong className="block text-xl text-body-color">
            {estimate.monthly.max > 0
              ? `${formatCurrency(estimate.monthly.min)} - ${formatCurrency(estimate.monthly.max)}`
              : "No incluido por ahora"}
          </strong>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-[18px] bg-white/80 p-4">
          <span className="mb-3 block text-sm font-semibold text-primary-500">Incluye en el alcance</span>
          <div className="flex flex-wrap gap-2">
            {featureModules.length > 0 ? (
              featureModules.map((item) => (
                <span key={item.key} className="tag">
                  {item.label}
                </span>
              ))
            ) : (
              <span className="type-body">Sin módulos adicionales por ahora.</span>
            )}
          </div>
        </div>
        <div className="rounded-[18px] bg-white/80 p-4">
          <span className="mb-3 block text-sm font-semibold text-primary-500">Servicios opcionales</span>
          <div className="flex flex-wrap gap-2">
            {serviceModules.length > 0 ? (
              serviceModules.map((item) => (
                <span key={item.key} className="tag">
                  {item.label}
                </span>
              ))
            ) : (
              <span className="type-body">Puedes sumarlos más adelante si lo necesitas.</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
