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
    <aside className="rounded-[24px] border border-white bg-gradient-to-br from-transparent to-white/80 p-5 shadow-[0_16px_30px_rgba(15,23,32,0.06)] lg:sticky lg:top-[120px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-600">Resumen</p>

      <div className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_10px_18px_rgba(15,23,32,0.04)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-500">Estimado inicial</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-body-color">
            {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}
          </p>
          <p className="mt-2 text-sm leading-6 text-body-color/75">Un rango orientativo para ayudarte a decidir el siguiente paso con más claridad.</p>
        </div>

        <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <DetailItem label="Proyecto" value={projectType?.label ?? "Sin definir"} />
          <DetailItem label="Tiempo estimado" value={`${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} semanas`} />
          <DetailItem label="Funciones" value={featureModules.length > 0 ? featureModules.map((item) => item.label).join(", ") : "Sin adicionales por ahora"} />
          <DetailItem
            label="Acompañamiento"
            value={
              serviceModules.length > 0
                ? `${serviceModules.map((item) => item.label).join(", ")} · ${formatCurrency(estimate.monthly.min)} - ${formatCurrency(estimate.monthly.max)} al mes`
                : "No incluido por ahora"
            }
          />
        </div>

        <div className="mt-5 border-t border-black/10 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-600">Qué sigue</p>
          <p className="mt-2 text-sm leading-6 text-body-color/75">
            Este resumen sirve para ordenar alcance y prioridades antes de compartir tus datos y continuar con la propuesta.
          </p>
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
