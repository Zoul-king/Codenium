"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteEstimator } from "@/features/quotes/components/quote-estimator";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { getInfrastructureLabel, getSelectedQuoteModules } from "@/features/quotes/lib/content";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteProjectTypes } from "@/lib/mocks";
import { readPlanProfilePreference, writePlanProfilePreference } from "@/lib/plan-profile";
import { parseQuoteSelectionParams, readQuoteSelection, writeQuoteSelection, type QuoteSelection } from "@/lib/quote-selection";
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
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<QuoteDraft>(createInitialDraft);
  const [selection, setSelection] = useState<QuoteSelection | null>(null);

  useEffect(() => {
    const fromParams = parseQuoteSelectionParams(searchParams);
    const nextSelection = fromParams ?? readQuoteSelection();

    setSelection(nextSelection);

    if (nextSelection) {
      writeQuoteSelection(nextSelection);
    }

    if (nextSelection?.profile) {
      writePlanProfilePreference(nextSelection.profile);
      setDraft((current) => ({ ...current, planProfile: nextSelection.profile ?? current.planProfile }));
    } else {
      setDraft((current) => ({ ...current, planProfile: readPlanProfilePreference() }));
    }
  }, [searchParams]);

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const selectedModules = getSelectedQuoteModules(draft.modules);
  const timelineLabel =
    draft.timelinePreference === "1-4" ? "1 a 4 meses" : draft.timelinePreference === "5-7" ? "5 a 7 meses" : "8 a 12 meses";
  const planLabel = draft.planProfile === "business" ? "Perfil empresarial" : "Perfil personal";
  const selectionLine = selection ? `${selection.source === "service" ? "Servicio seleccionado" : "Plan seleccionado"}: ${selection.label}.` : "Seleccion aun pendiente.";

  const quoteMessage = [
    `Quiero recibir un estimado inicial para ${projectType.label}.`,
    selectionLine,
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
        <div className="mb-8 flex flex-col gap-4" data-animate="fadeInFromTop">
          <span className="type-kicker-accent">Cotizador</span>
          <div className="max-w-4xl">
            <h2 className="text-[28px] font-bold leading-8 text-body-color lg:text-[40px] lg:leading-[48px]">
              Ajusta el escenario de tu proyecto y aterriza una lectura inicial
            </h2>
          </div>
        </div>

        <div className="quote-form-grid">
          <div className="space-y-6">
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="quote-panel">
                <h3 className="text-xl font-semibold text-slate-950">Escoge lo mas cercano a tu proyecto para obtener una cotizacion inicial</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  La idea es que llegues al formulario con un punto de partida claro, no con una hoja en blanco.
                </p>
              </div>

              <aside className="quote-subpanel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-500">Ruta rapida</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">No has escogido un plan?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Revisa los planes para comparar perfiles personales y empresariales antes de continuar con el formulario.
                </p>
                <Link href="/plans" className="accent-button mt-5">
                  Ver planes
                </Link>
              </aside>
            </div>

            <QuoteEstimator draft={draft} onChange={setDraft} />

            <section id="quote-form" className="quote-panel">
              <div className="mb-6 border-b border-slate-200 pb-4">
                <span className="type-kicker-accent">Formulario</span>
                <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-slate-950">Comparte tu proyecto</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                  Si este rango inicial hace sentido, deja tus datos y seguimos con una propuesta mas precisa.
                </p>
              </div>
              <ContactForm
                kicker=""
                title=""
                description=""
                submitLabel="Continuar"
                initialValues={{ message: quoteMessage }}
                successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta mas precisa."
                reverseColumns
                hideContactInfo
                formCard={false}
              />
            </section>
          </div>

          <QuoteSummaryCard draft={draft} estimate={estimate} selection={selection} />
        </div>
      </div>
    </section>
  );
}
