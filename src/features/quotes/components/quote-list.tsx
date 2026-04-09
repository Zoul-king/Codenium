import { getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { formatLongDate, getQuoteStatusLabel } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

import { formatCurrency } from "@/features/quotes/lib/estimate";

interface QuoteListProps {
  role?: Role;
}

export function QuoteList({ role }: QuoteListProps) {
  const items = role ? getVisibleQuotes(role) : getVisibleQuotes("admin");

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((quote) => (
        <article key={quote.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="mb-2 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500">{quote.code}</span>
              <h3 className="text-xl font-bold text-body-color">{quote.title}</h3>
              <p className="type-body mt-2">Creada el {formatLongDate(quote.createdAt)}</p>
            </div>
            <span className="tag">{getQuoteStatusLabel(quote.status)}</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <span className="text-sm font-semibold text-primary-500">Estimado inicial</span>
              <p className="mt-1 font-bold text-body-color">
                {formatCurrency(quote.estimate.build.min)} - {formatCurrency(quote.estimate.build.max)}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-500">Tiempo estimado</span>
              <p className="mt-1 font-bold text-body-color">
                {quote.estimate.timelineWeeks.min} - {quote.estimate.timelineWeeks.max} semanas
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-500">Soporte mensual</span>
              <p className="mt-1 font-bold text-body-color">
                {quote.estimate.monthly.max > 0
                  ? `${formatCurrency(quote.estimate.monthly.min)} - ${formatCurrency(quote.estimate.monthly.max)}`
                  : "No incluido"}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
