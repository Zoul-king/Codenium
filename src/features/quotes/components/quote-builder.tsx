"use client";

import { useMemo, useState } from "react";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteEstimator } from "@/features/quotes/components/quote-estimator";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { getInfrastructureLabel, getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { readPlanProfilePreference } from "@/lib/plan-profile";
import { quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft } from "@/lib/types/domain";

function createInitialDraft(): QuoteDraft {
  return {
    planProfile: readPlanProfilePreference(),
    projectType: "corporate",
    objective: "",
    infrastructure: "existing",
    timelinePreference: "5-7",
    modules: ["custom-design"]
  };
}

export function QuoteBuilder() {
  const [draft, setDraft] = useState<QuoteDraft>(createInitialDraft);

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const timelineLabel =
    draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : "8 a 12 meses";
  const planLabel = draft.planProfile === "business" ? "Perfil empresarial" : "Perfil personal";

  const quoteMessage = [
    `Quiero recibir un estimado inicial para ${projectType.label}.`,
    `Perfil de plan: ${planLabel}.`,
    draft.objective.trim() ? `Objetivo: ${draft.objective.trim()}.` : "Objetivo: por definir en llamada.",
    `Infraestructura: ${getInfrastructureLabel(draft.infrastructure)}.`,
    `Tiempo deseado: ${timelineLabel}.`,
    `Configuracion elegida: ${selectedModules.length > 0 ? selectedModules.map((item) => item.label).join(", ") : "sin elementos adicionales por ahora"}.`,
    `Rango estimado: ${formatCurrency(estimate.build.min)} a ${formatCurrency(estimate.build.max)} MXN.`
  ].join(" ");

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="quote-form-grid">
          <div className="space-y-10">
            <QuoteEstimator draft={draft} onChange={setDraft} />
            <div className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_44px_rgba(14,20,36,0.08)] lg:p-8">
              <ContactForm
                kicker="Formulario"
                title="Rellena los campos"
                description="Si este rango inicial hace sentido para tu proyecto, comparte tu informacion y continuamos contigo."
                submitLabel="Continuar"
                initialValues={{ message: quoteMessage }}
                successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta mas precisa."
                reverseColumns
                hideContactInfo
              />
            </div>
          </div>
          <QuoteSummaryCard draft={draft} estimate={estimate} />
        </div>
      </div>
    </section>
  );
}
