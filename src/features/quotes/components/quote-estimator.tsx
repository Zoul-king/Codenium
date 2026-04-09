"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { quoteSections } from "@/features/quotes/lib/content";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { quoteModules, quoteProjectTypes } from "@/lib/mocks";
import { cn } from "@/lib/utils";
import type { QuoteDraft, QuoteModuleKey } from "@/lib/types/domain";

interface QuoteEstimatorProps {
  draft: QuoteDraft;
  onChange: (draft: QuoteDraft) => void;
}

type QuoteSectionKey = (typeof quoteSections)[number]["key"];

export function QuoteEstimator({ draft, onChange }: QuoteEstimatorProps) {
  const [openSection, setOpenSection] = useState<QuoteSectionKey>("project");

  function updateProjectType(projectType: QuoteDraft["projectType"]) {
    onChange({ ...draft, projectType });
    setOpenSection("features");
  }

  function toggleModule(moduleKey: QuoteModuleKey) {
    const modules = draft.modules.includes(moduleKey)
      ? draft.modules.filter((item) => item !== moduleKey)
      : [...draft.modules, moduleKey];

    onChange({ ...draft, modules });
  }

  return (
    <div
      className="relative space-y-4 overflow-hidden rounded-[24px] border border-[#D7E2E7] bg-[#F9FBFC] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(222,230,234,0.95),0_14px_26px_rgba(15,23,32,0.05)] sm:px-5"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(252,254,255,0.98) 0%, rgba(244,248,250,0.98) 100%), linear-gradient(135deg, rgba(20,92,120,0.08), transparent 46%)"
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px] bg-[linear-gradient(90deg,rgba(20,92,120,0.18)_0%,rgba(20,92,120,0.48)_50%,rgba(20,92,120,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[4px] bg-[linear-gradient(90deg,rgba(20,92,120,0.14)_0%,rgba(20,92,120,0.34)_50%,rgba(20,92,120,0.14)_100%)]" />

      <div className="max-w-2xl space-y-3">
        <span className="type-kicker">Estimado inicial</span>
        <h2 className="text-[28px] font-bold leading-8 text-body-color lg:text-[34px] lg:leading-[42px]">Responde unas preguntas y obtén un estimado inicial</h2>
        <p className="type-body">
          Define la base de tu proyecto, suma lo que necesitas y revisa un rango orientativo antes de continuar con tu solicitud.
        </p>
      </div>

      <div className="space-y-3">
        {quoteSections.map((section) => (
          <QuoteSection
            key={section.key}
            title={section.title}
            description={section.description}
            isOpen={openSection === section.key}
            onToggle={() => setOpenSection(section.key)}
          >
            {section.key === "project" ? (
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {quoteProjectTypes.map((item) => {
                  const selected = draft.projectType === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateProjectType(item.key)}
                      className={getOptionButtonClass(selected)}
                    >
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-[#556670]")}>{item.description}</span>
                      <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-[#145C78]")}>
                        Desde {formatCurrency(item.base.min)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {section.key === "features" ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {quoteModules
                  .filter((item) => item.group === "feature")
                  .map((item) => {
                    const selected = draft.modules.includes(item.key);

                    return (
                      <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={getOptionButtonClass(selected)}>
                        <div className="flex items-start justify-between gap-3">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className={cn("rounded-full px-2 py-1 text-[11px] font-semibold", selected ? "bg-white/15 text-white" : "bg-[#F4F8FA] text-[#145C78]")}>
                            {selected ? "Incluido" : "Agregar"}
                          </span>
                        </div>
                        <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-[#556670]")}>{item.description}</span>
                        <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-[#145C78]")}>
                          {formatCurrency(item.price.min)} - {formatCurrency(item.price.max)}
                        </span>
                      </button>
                    );
                  })}
              </div>
            ) : null}

            {section.key === "services" ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {quoteModules
                  .filter((item) => item.group === "service")
                  .map((item) => {
                    const selected = draft.modules.includes(item.key);

                    return (
                      <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={getOptionButtonClass(selected)}>
                        <div className="flex items-start justify-between gap-3">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className={cn("rounded-full px-2 py-1 text-[11px] font-semibold", selected ? "bg-white/15 text-white" : "bg-[#F4F8FA] text-[#145C78]")}>
                            {selected ? "Activo" : "Opcional"}
                          </span>
                        </div>
                        <span className={cn("mt-1 block text-xs leading-5", selected ? "text-white/82" : "text-[#556670]")}>{item.description}</span>
                        <span className={cn("mt-3 block text-xs font-semibold", selected ? "text-white" : "text-[#145C78]")}>
                          Desde {formatCurrency(item.monthly?.min ?? 0)} al mes
                        </span>
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
    <section className="rounded-[18px] border border-[#D5E0E5] bg-white px-4 py-3 shadow-[0_10px_18px_rgba(15,23,32,0.04)]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 text-left">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#145C78]">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-[#556670]">{description}</span>
        </div>
        <span className={cn("shrink-0 text-lg leading-none text-[#145C78] transition-transform duration-200", isOpen ? "rotate-45" : "rotate-0")} aria-hidden="true">
          +
        </span>
      </button>

      <div className={cn("grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-200 ease-out", isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0">{children}</div>
      </div>
    </section>
  );
}

function getOptionButtonClass(isActive: boolean) {
  return isActive
    ? "rounded-[14px] border border-[#145C78] bg-[#145C78] px-3 py-3 text-left text-white shadow-[0_8px_16px_rgba(20,92,120,0.1)]"
    : "rounded-[14px] border border-[#D5E0E5] bg-[#FCFDFD] px-3 py-3 text-left text-[#314049] transition hover:border-[#145C78]/28 hover:bg-white";
}
