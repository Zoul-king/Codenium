"use client";

import { useMemo, useState } from "react";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteEstimator } from "@/features/quotes/components/quote-estimator";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft } from "@/lib/types/domain";

const initialDraft: QuoteDraft = {
  projectType: "corporate",
  modules: ["custom-design", "maintenance"]
};

export function QuoteBuilder() {
  const [draft, setDraft] = useState<QuoteDraft>(initialDraft);

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const selectedModules = getSelectedQuoteModules(draft.modules);

  const quoteMessage = [
    `Quiero recibir un estimado inicial para ${projectType.label}.`,
    `Configuración elegida: ${selectedModules.length > 0 ? selectedModules.map((item) => item.label).join(", ") : "sin elementos adicionales por ahora"}.`,
    `Rango estimado: ${formatCurrency(estimate.build.min)} a ${formatCurrency(estimate.build.max)} MXN.`,
    `Tiempo estimado: ${estimate.timelineWeeks.min} a ${estimate.timelineWeeks.max} semanas.`
  ].join(" ");

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <QuoteEstimator draft={draft} onChange={setDraft} />
          <QuoteSummaryCard draft={draft} estimate={estimate} />
        </div>

        <div className="mt-8">
          <ContactForm
            kicker="Continuar"
            title="Déjanos tus datos"
            description="Si este rango inicial hace sentido para tu proyecto, comparte tu información y continuamos contigo."
            submitLabel="Continuar"
            initialValues={{ message: quoteMessage }}
            successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta más precisa."
          />
        </div>
      </div>
    </section>
  );
}
