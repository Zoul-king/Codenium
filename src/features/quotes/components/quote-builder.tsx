"use client";

import { useMemo, useState } from "react";

import { ContactForm } from "@/features/marketing/components/contact-form";
import { QuoteSummaryCard } from "@/features/quotes/components/quote-summary-card";
import { calculateQuoteEstimate, formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import type { QuoteDraft, QuoteModuleKey } from "@/lib/types/domain";

const steps = [
  { key: "project", label: "Tipo de proyecto" },
  { key: "modules", label: "Modulos" },
  { key: "summary", label: "Pre cotizacion" },
  { key: "contact", label: "Tus datos" }
] as const;

export function QuoteBuilder() {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>({
    projectType: "corporate",
    modules: ["custom-design", "maintenance"]
  });

  const estimate = useMemo(() => calculateQuoteEstimate(draft), [draft]);
  const projectType = quoteProjectTypes.find((item) => item.key === draft.projectType) ?? quoteProjectTypes[0];

  const quoteMessage = [
    `Estoy solicitando una pre cotizacion para ${projectType.label}.`,
    `Modulos seleccionados: ${
      draft.modules.length > 0
        ? quoteModules
            .filter((item) => draft.modules.includes(item.key))
            .map((item) => item.label)
            .join(", ")
        : "sin modulos extra"
    }.`,
    `Rango estimado: ${formatCurrency(estimate.build.min)} a ${formatCurrency(estimate.build.max)} MXN.`,
    `Tiempo estimado: ${estimate.timelineWeeks.min} a ${estimate.timelineWeeks.max} semanas.`
  ].join(" ");

  function toggleModule(moduleKey: QuoteModuleKey) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.includes(moduleKey)
        ? current.modules.filter((item) => item !== moduleKey)
        : [...current.modules, moduleKey]
    }));
  }

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="mb-10 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Cotizador inicial</span>
          <h2 className="type-section-title mt-4">
            Armemos una <span className="text-secondary-500">pre cotizacion</span>
          </h2>
          <p className="type-body mx-auto mt-4 max-w-3xl">
            Este flujo nos ayuda a entender tu necesidad, estimar rango de inversion y conectar tu solicitud con nuestro proceso comercial.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`rounded-[18px] border px-4 py-3 text-sm font-semibold transition-colors ${
                index === stepIndex
                  ? "border-primary-500 bg-primary-50 text-primary-500"
                  : "border-black/10 bg-white text-body-color"
              }`}
            >
              <span className="mb-1 block text-xs font-normal uppercase tracking-[0.18em]">Paso {index + 1}</span>
              {step.label}
            </div>
          ))}
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
                <span className="type-card-title text-left">{item.label}</span>
                <p className="type-body text-left">{item.description}</p>
                <div className="mt-auto pt-2 text-sm font-semibold text-primary-500">
                  {formatCurrency(item.base.min)} - {formatCurrency(item.base.max)}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {quoteModules.map((item) => {
              const selected = draft.modules.includes(item.key);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleModule(item.key)}
                  className={`rounded-[20px] bg-white p-6 text-left shadow-md transition-all duration-300 ${
                    selected ? "border border-primary-500 bg-primary-50" : "border border-transparent"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-body-color">{item.label}</h3>
                      <p className="type-body mt-2">{item.description}</p>
                    </div>
                    <span className={`tag ${selected ? "!border-primary-500 !bg-white" : ""}`}>
                      {selected ? "Activo" : "Opcional"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary-500">
                    {item.monthly
                      ? `Desde ${formatCurrency(item.monthly.min)} / mes`
                      : `${formatCurrency(item.price.min)} - ${formatCurrency(item.price.max)}`}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <QuoteSummaryCard draft={draft} estimate={estimate} />
            <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
              <span className="type-kicker">Siguiente paso</span>
              <h3 className="mt-4 text-2xl font-bold text-body-color">Conectemos este estimado con tu solicitud</h3>
              <p className="type-body mt-4">
                Al continuar, enviaremos esta pre cotizacion junto con tus datos para que podamos afinar alcance, prioridades y una propuesta formal.
              </p>
              <div className="mt-6 rounded-[18px] bg-foreground p-4">
                <p className="text-sm font-semibold text-primary-500">Resumen rapido</p>
                <ul className="mt-3 space-y-2 text-sm text-body-color">
                  <li>Proyecto: {projectType.label}</li>
                  <li>Build: {formatCurrency(estimate.build.min)} - {formatCurrency(estimate.build.max)}</li>
                  <li>Tiempo: {estimate.timelineWeeks.min} - {estimate.timelineWeeks.max} semanas</li>
                </ul>
              </div>
            </article>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <ContactForm
            kicker="Completar solicitud"
            title="Cierra tu pre cotizacion con tus datos"
            description="Usa el mismo canal de contacto del sitio para compartir esta pre cotizacion y continuar con una propuesta formal."
            submitLabel="Enviar pre cotizacion"
            summary={<QuoteSummaryCard draft={draft} estimate={estimate} />}
            initialValues={{ message: quoteMessage }}
            successMessage="Recibimos tu pre cotizacion. El siguiente paso es revisar alcance y devolverte una propuesta ajustada."
          />
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button type="button" onClick={previousStep} className="secondary-button w-full !justify-center sm:w-auto" disabled={stepIndex === 0}>
            Regresar
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="primary-button w-full !justify-center sm:w-auto"
            disabled={stepIndex === steps.length - 1}
          >
            Continuar
          </button>
        </div>
      </div>
    </section>
  );
}
