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

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <span className="type-kicker">Siguiente paso</span>
            <h3 className="mt-4 text-2xl font-bold text-body-color">Cuando estés listo, continuamos contigo</h3>
            <p className="type-body mt-4">
              Si este estimado va en la dirección correcta, comparte tus datos y afinamos alcance, tiempos y prioridades contigo.
            </p>
            <div className="mt-6 rounded-[18px] bg-foreground p-4">
              <p className="text-sm font-semibold text-primary-500">Importante</p>
              <ul className="mt-3 space-y-2 text-sm text-body-color">
                <li>Este rango es una guía inicial, no una propuesta cerrada.</li>
                <li>Podemos ajustar el alcance según tus objetivos y lo que hoy sea más urgente.</li>
                <li>Tu resumen se enviará junto con el formulario para no empezar desde cero.</li>
              </ul>
            </div>
          </article>

          <div id="quote-contact">
            <ContactForm
              kicker="Continuar"
              title="Déjanos tus datos"
              description="Comparte tu información y te contactaremos para convertir este estimado en una propuesta clara."
              submitLabel="Continuar"
              initialValues={{ message: quoteMessage }}
              successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta más precisa."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
