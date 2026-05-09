"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteEstimator } from "@/features/quotes/components/quote-estimator";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { getInfrastructureLabel, getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/config/catalogs";
import { readPlanProfilePreference, writePlanProfilePreference } from "@/features/marketing/lib/plan-profile-store";
import { clearQuoteSelection, parseQuoteSelectionParams, readQuoteSelection, writeQuoteSelection, type QuoteSelection } from "@/features/quotes/lib/quote-selection";
import type { QuoteDraft } from "@/lib/types/domain";

function createInitialDraft(): QuoteDraft {
  return {
    planProfile: readPlanProfilePreference(),
    projectType: null,
    objective: "",
    infrastructure: null,
    timelinePreference: null,
    modules: []
  };
}

export function QuoteBuilder() {
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<QuoteDraft>(createInitialDraft);
  const [selection, setSelection] = useState<QuoteSelection | null>(null);

  useEffect(() => {
    const fromParams = parseQuoteSelectionParams(searchParams);
    const nextSelection = fromParams ?? readQuoteSelection();
    const planSelection = nextSelection?.source === "plan" ? nextSelection : null;

    setSelection(planSelection);

    if (planSelection) {
      writeQuoteSelection(planSelection);
      if (planSelection.profile) {
        writePlanProfilePreference(planSelection.profile);
        setDraft((current) => ({ ...current, planProfile: planSelection.profile ?? current.planProfile }));
      }
    } else {
      clearQuoteSelection();
      setDraft((current) => ({ ...current, planProfile: readPlanProfilePreference() }));
    }
  }, [searchParams]);

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType);
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const timelineLabel =
    draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : draft.timelinePreference === "8-12" ? "8 a 12 meses" : "Pendiente";
  const planLabel = draft.planProfile === "business" ? "Perfil empresarial" : "Perfil personal";

  const hiddenFields = {
    intake_source: "plan",
    selected_plan: selection?.label ?? "",
    plan_profile: planLabel,
    project_category: projectType?.label ?? "",
    objective: draft.objective.trim(),
    infrastructure: draft.infrastructure ? getInfrastructureLabel(draft.infrastructure) : "",
    timeline: timelineLabel,
    capabilities: selectedModules.map((item) => item.label).join(", "),
    estimate_range: estimate.build.max > 0 ? `${formatCurrency(estimate.build.min)} - ${formatCurrency(estimate.build.max)}` : ""
  };

  return (
    <section className="section soft-section bg-surface-soft">
      <div className="site-shell py-16 lg:py-20">
        <div className="mb-8 flex flex-col gap-3" data-animate="fadeInFromTop">
          <span className="type-kicker-accent">Cotizador</span>
          <h2 className="max-w-4xl text-[28px] font-bold leading-8 text-body-color lg:text-[40px] lg:leading-[48px]">
            Escoge lo más cercano a tu proyecto para obtener una cotización inicial
          </h2>
        </div>

        <div className="quote-form-grid">
          <div className="space-y-6">
            <div className="quote-subpanel">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-500">Plan seleccionado</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{selection?.label ?? "Aun no has escogido un plan"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selection ? "Ya llegaste con un plan como referencia. Ahora puedes ajustar el escenario del proyecto y enviar tus datos." : "Si quieres comparar rutas antes de llenar el formulario, aqui puedes volver a revisar los planes."}
              </p>
              {!selection ? (
                <Link href="/plans" className="accent-button mt-5">
                  Ver planes
                </Link>
              ) : null}
            </div>

            <QuoteEstimator draft={draft} onChange={setDraft} />

            <div className="space-y-3">
              <span className="type-kicker-accent">Formulario</span>
              <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-slate-950">Rellena tus datos</h3>
            </div>

            <section id="quote-form" className="quote-panel">
              <ContactForm
                source="quote"
                kicker=""
                title=""
                description=""
                submitLabel="Continuar"
                successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta mas precisa."
                reverseColumns
                hideContactInfo
                formCard={false}
                embedded
                hiddenFields={hiddenFields}
              />
            </section>
          </div>

          <QuoteSummaryCard draft={draft} estimate={estimate} selection={selection} />
        </div>
      </div>
    </section>
  );
}