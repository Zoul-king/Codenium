"use client";

import { useState, type ReactNode } from "react";

import { TextAreaField } from "@/components/ui/form-controls";
import { quoteSections } from "@/features/quotes/lib/content";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import { cn } from "@/lib/utils";
import type { QuoteDraft, QuoteModuleKey, QuoteTimelinePreference } from "@/lib/types/domain";

interface QuoteEstimatorProps {
  draft: QuoteDraft;
  onChange: (draft: QuoteDraft) => void;
}

type QuoteSectionKey = (typeof quoteSections)[number]["key"];

const timelineOptions: Array<{ key: QuoteTimelinePreference; label: string }> = [
  { key: "1-4", label: "de 1 a 4 meses" },
  { key: "5-7", label: "de 5 a 7 meses" },
  { key: "8-12", label: "de 8 a 12 meses" }
];

export function QuoteEstimator({ draft, onChange }: QuoteEstimatorProps) {
  const [openSection, setOpenSection] = useState<QuoteSectionKey | null>("project");

  function updateProjectType(projectType: QuoteDraft["projectType"]) {
    onChange({ ...draft, projectType });
    setOpenSection("objective");
  }

  function toggleModule(moduleKey: QuoteModuleKey) {
    const modules = draft.modules.includes(moduleKey) ? draft.modules.filter((item) => item !== moduleKey) : [...draft.modules, moduleKey];

    onChange({ ...draft, modules });
  }

  return (
    <div className="rounded-[28px] border border-white bg-gradient-to-br from-transparent to-white/85 p-6 shadow-[0_18px_44px_rgba(14,20,36,0.08)]">
      <div className="max-w-2xl space-y-3">
        <span className="type-kicker">Cotizador</span>
        <h2 className="text-[28px] font-bold leading-8 text-body-color lg:text-[34px] lg:leading-[42px]">Define tu proyecto y revisa un estimado inicial</h2>
        <p className="type-body">La experiencia ahora sigue una secuencia mas natural: categoria, objetivo, tiempo, capacidades y soporte.</p>
      </div>

      <div className="mt-6 space-y-3">
        {quoteSections.map((section) => (
          <QuoteSection
            key={section.key}
            title={section.title}
            description={section.description}
            isOpen={openSection === section.key}
            onToggle={() => setOpenSection((current) => (current === section.key ? null : section.key))}
          >
            {section.key === "project" ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {quoteProjectTypes.map((item) => {
                  const selected = draft.projectType === item.key;

                  return (
                    <button key={item.key} type="button" onClick={() => updateProjectType(item.key)} className={getOptionButtonClass(selected)}>
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-body-color/70")}>{item.description}</span>
                      <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-secondary-600")}>Desde {formatCurrency(item.base.min)}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {section.key === "objective" ? (
              <TextAreaField
                label="Que quieres lograr?"
                placeholder="Ej. Necesito un dashboard para visualizar ventas, seguimiento comercial y reportes para direccion."
                rows={5}
                value={draft.objective}
                onChange={(value) => onChange({ ...draft, objective: value })}
              />
            ) : null}

            {section.key === "timeline" ? (
              <div className="grid gap-3 md:grid-cols-3">
                {timelineOptions.map((option) => (
                  <button key={option.key} type="button" onClick={() => onChange({ ...draft, timelinePreference: option.key })} className={getOptionButtonClass(draft.timelinePreference === option.key)}>
                    <span className="block text-sm font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {section.key === "features" ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {quoteModules.filter((item) => item.group === "feature").map((item) => {
                  const selected = draft.modules.includes(item.key);

                  return (
                    <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={getOptionButtonClass(selected)}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className={cn("text-[11px] font-semibold", selected ? "text-white" : "text-secondary-600")}>{selected ? "Incluido" : "Agregar"}</span>
                      </div>
                      <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-body-color/70")}>{item.description}</span>
                      <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-secondary-600")}>
                        {formatCurrency(item.price.min)} - {formatCurrency(item.price.max)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {section.key === "services" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {quoteModules.filter((item) => item.group === "service").map((item) => {
                  const selected = draft.modules.includes(item.key);

                  return (
                    <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={getOptionButtonClass(selected)}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className={cn("text-[11px] font-semibold", selected ? "text-white" : "text-secondary-600")}>{selected ? "Activo" : "Opcional"}</span>
                      </div>
                      <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-body-color/70")}>{item.description}</span>
                      <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-secondary-600")}>Desde {formatCurrency(item.monthly?.min ?? 0)} al mes</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </QuoteSection>
        ))}
      </div>
    </div>
  );
}

interface QuoteSectionProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function QuoteSection({ title, description, isOpen, onToggle, children }: QuoteSectionProps) {
  return (
    <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 text-left">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-600">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-body-color/70">{description}</span>
        </div>
        <span className={cn("shrink-0 text-lg leading-none text-secondary-600 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen ? "rotate-45" : "rotate-0")} aria-hidden="true">
          +
        </span>
      </button>

      <div className={cn("quote-expand overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen ? "mt-4 grid grid-rows-[1fr] opacity-100" : "mt-0 grid grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0">{children}</div>
      </div>
    </section>
  );
}

function getOptionButtonClass(isActive: boolean) {
  return isActive
    ? "rounded-[16px] border border-primary-500 bg-primary-500 px-4 py-4 text-left text-white shadow-[0_12px_24px_rgba(34,74,120,0.18)]"
    : "rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4 text-left text-body-color transition hover:border-secondary-500/30 hover:bg-white";
}
