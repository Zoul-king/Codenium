"use client";

import { useMemo, useState } from "react";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { getSelectedQuoteModules, quoteModuleGroups, quoteSteps } from "@/features/quotes/lib/content";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteModuleKey } from "@/lib/types/domain";

export function QuoteBuilder() {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>({
    projectType: "corporate",
    modules: ["custom-design", "maintenance"]
  });

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];
  const selectedModules = getSelectedQuoteModules(draft.modules);

  const quoteMessage = [
    `Quiero recibir un estimado inicial para ${projectType.label}.`,
    `Alcance seleccionado: ${selectedModules.length > 0 ? selectedModules.map((item) => item.label).join(", ") : "sin módulos adicionales por ahora"}.`,
    `Rango estimado de inversión: ${formatCurrency(estimate.build.min)} a ${formatCurrency(estimate.build.max)} MXN.`,
    `Tiempo estimado: ${estimate.timelineWeeks.min} a ${estimate.timelineWeeks.max} semanas.`
  ].join(" ");

  const activeStep = quoteSteps[stepIndex];

  function toggleModule(moduleKey: QuoteModuleKey) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.includes(moduleKey)
        ? current.modules.filter((item) => item !== moduleKey)
        : [...current.modules, moduleKey]
    }));
  }

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, quoteSteps.length - 1));
  }

  function previousStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function getNextLabel() {
    if (stepIndex === 0) {
      return "Continuar con funcionalidades";
    }

    if (stepIndex === 1) {
      return "Ver estimado inicial";
    }

    if (stepIndex === 2) {
      return "Continuar con mis datos";
    }

    return "Continuar";
  }

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="mb-10 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Estimado inicial</span>
          <h2 className="type-section-title mt-4">
            Armemos una <span className="text-secondary-500">pre cotización</span> clara desde el inicio
          </h2>
          <p className="type-body mx-auto mt-4 max-w-3xl">
            Responde unas cuantas preguntas para definir el tipo de proyecto, sumar lo que necesitas y recibir un rango orientativo antes de pasar a una propuesta formal.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          {quoteSteps.map((step, index) => (
            <div
              key={step.key}
              className={`rounded-[18px] border px-4 py-4 text-sm transition-colors ${
                index === stepIndex
                  ? "border-primary-500 bg-primary-50 text-primary-500"
                  : "border-black/10 bg-white text-body-color"
              }`}
            >
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em]">Paso {index + 1}</span>
              <strong className="block text-[15px] leading-6">{step.label}</strong>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" data-animate="fadeIn">
          <span className="type-kicker">Paso {stepIndex + 1}</span>
          <h3 className="mt-3 text-2xl font-bold text-body-color">{activeStep.label}</h3>
          <p className="type-body mt-3 max-w-3xl">{activeStep.helper}</p>
        </div>

        {stepIndex === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {quoteProjectTypes.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, projectType: item.key }))}
                className={`service-card items-start text-left ${
                  draft.projectType === item.key ? "border border-primary-500 bg-primary-50" : ""
                }`}
              >
                <span className="mb-3 inline-flex rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">
                  Ideal para
                </span>
                <span className="type-card-title text-left">{item.label}</span>
                <p className="type-body text-left">{item.description}</p>
                <div className="mt-4 text-sm font-semibold text-primary-500">
                  Desde {formatCurrency(item.base.min)} hasta {formatCurrency(item.base.max)}
                </div>
                <p className="mt-2 text-sm text-body-color">Tiempo estimado: {item.timelineWeeks.min} a {item.timelineWeeks.max} semanas</p>
              </button>
            ))}
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="space-y-8">
            {quoteModuleGroups.map((group) => {
              const items = quoteModules.filter((item) => item.group === group.key);

              return (
                <section key={group.key}>
                  <div className="mb-4">
                    <span className="type-kicker">{group.label}</span>
                    <p className="type-body mt-3 max-w-3xl">{group.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                      const selected = draft.modules.includes(item.key);

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleModule(item.key)}
                          className={`rounded-[20px] bg-white p-6 text-left shadow-[0_16px_40px_rgba(14,20,36,0.08)] transition-all duration-300 ${
                            selected ? "border border-primary-500 bg-primary-50" : "border border-transparent"
                          }`}
                        >
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-body-color">{item.label}</h3>
                              <p className="type-body mt-2">{item.description}</p>
                            </div>
                            <span className={`tag ${selected ? "!border-primary-500 !bg-white" : ""}`}>
                              {selected ? "Incluido" : item.group === "service" ? "Opcional" : "Agregar"}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-primary-500">
                            {item.monthly
                              ? `Desde ${formatCurrency(item.monthly.min)} al mes`
                              : `Desde ${formatCurrency(item.price.min)} hasta ${formatCurrency(item.price.max)}`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <QuoteSummaryCard draft={draft} estimate={estimate} />
            <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
              <span className="type-kicker">Qué sigue</span>
              <h3 className="mt-4 text-2xl font-bold text-body-color">Convirtamos este estimado en una conversación útil</h3>
              <p className="type-body mt-4">
                Este rango nos ayuda a alinear expectativas. El siguiente paso es compartir tus datos para revisar alcance, prioridades y preparar una propuesta más precisa.
              </p>
              <div className="mt-6 rounded-[18px] bg-foreground p-4">
                <p className="text-sm font-semibold text-primary-500">Importante</p>
                <ul className="mt-3 space-y-2 text-sm text-body-color">
                  <li>Es un estimado inicial, no un precio final cerrado.</li>
                  <li>Los tiempos y montos pueden afinarse según alcance, contenidos e integraciones.</li>
                  <li>Tu solicitud llegará con este resumen para no empezar desde cero.</li>
                </ul>
              </div>
            </article>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <ContactForm
            kicker="Último paso"
            title="Déjanos tus datos y continuamos contigo"
            description="Comparte tu información para enviarte seguimiento sobre este estimado inicial y ayudarte a aterrizar la propuesta."
            submitLabel="Enviar estimado inicial"
            summary={<QuoteSummaryCard draft={draft} estimate={estimate} />}
            initialValues={{ message: quoteMessage }}
            successMessage="Recibimos tu solicitud. El siguiente paso es revisar el alcance contigo y preparar una propuesta más precisa."
          />
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button type="button" onClick={previousStep} className="secondary-button w-full !justify-center sm:w-auto" disabled={stepIndex === 0}>
            Volver
          </button>
          {stepIndex < quoteSteps.length - 1 ? (
            <button type="button" onClick={nextStep} className="primary-button w-full !justify-center sm:w-auto">
              {getNextLabel()}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
