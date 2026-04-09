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
  objective: "",
  timelinePreference: "5-7",
  modules: ["custom-design"]
};

export function QuoteBuilder() {
  const [draft, setDraft] = useState<QuoteDraft>(initialDraft);

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const timelineLabel =
    draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : "8 a 12 meses";

  const quoteMessage = [
    `Quiero recibir un estimado inicial para ${projectType.label}.`,
    draft.objective.trim() ? `Objetivo: ${draft.objective.trim()}.` : "Objetivo: por definir en llamada.",
    `Tiempo deseado: ${timelineLabel}.`,
    `Configuracion elegida: ${selectedModules.length > 0 ? selectedModules.map((item) => item.label).join(", ") : "sin elementos adicionales por ahora"}.`,
    `Rango estimado: ${formatCurrency(estimate.build.min)} a ${formatCurrency(estimate.build.max)} MXN.`,
    `Tiempo estimado del sistema: ${estimate.timelineWeeks.min} a ${estimate.timelineWeeks.max} semanas.`
  ].join(" ");

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.16fr_0.84fr] lg:items-start">
          <QuoteEstimator draft={draft} onChange={setDraft} />
          <QuoteSummaryCard draft={draft} estimate={estimate} />
        </div>

        <div className="mt-8">
          <ContactForm
            kicker="Continuar"
            title="Deja tus datos"
            description="Si este rango inicial hace sentido para tu proyecto, comparte tu informacion y continuamos contigo."
            submitLabel="Continuar"
            initialValues={{ message: quoteMessage }}
            successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta mas precisa."
            summary={<QuoteSummaryCard draft={draft} estimate={estimate} compact />}
          />
        </div>
      </div>
    </section>
  );
}
