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
    <aside className="rounded-[24px] border border-[#D8E2E7] bg-white p-5 shadow-[0_16px_30px_rgba(15,23,32,0.06)] lg:sticky lg:top-[120px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#145C78]">Resumen</p>

      <div className="mt-4 rounded-[18px] border border-[#D8E2E7] bg-[linear-gradient(180deg,#FBFDFE_0%,#F6FAFC_100%)] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#145C78]">Estimado inicial</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-[#0F1720]">
            {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#42525D]">
            Un rango orientativo para ayudarte a tomar la siguiente decisión con más claridad.
          </p>
        </div>

        <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <DetailItem label="Proyecto" value={projectType?.label ?? "Sin definir"} />
          <DetailItem label="Tiempo estimado" value={`${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} semanas`} />
          <DetailItem
            label="Funciones elegidas"
            value={featureModules.length > 0 ? featureModules.map((item) => item.label).join(", ") : "Sin adicionales por ahora"}
          />
          <DetailItem
            label="Acompañamiento"
            value={
              serviceModules.length > 0
                ? `${serviceModules.map((item) => item.label).join(", ")} · ${formatCurrency(estimate.monthly.min)} - ${formatCurrency(estimate.monthly.max)} al mes`
                : "No incluido por ahora"
            }
          />
        </div>

        <div className="mt-5 border-t border-[#D8E2E7] pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#145C78]">Qué obtienes aquí</p>
          <p className="mt-2 text-sm leading-6 text-[#42525D]">
            Este resumen te ayuda a aterrizar el alcance antes de compartir tus datos. El precio final puede ajustarse según contenidos, integraciones y nivel de detalle.
          </p>
        </div>
      </div>
    </aside>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A8993]">{label}</p>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-[#0F1720]">{value}</p>
    </div>
  );
}
