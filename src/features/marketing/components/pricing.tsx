"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { PlanCatalog } from "@/features/marketing/types";
import { readPlanProfilePreference, writePlanProfilePreference } from "@/lib/plan-profile";
import type { PlanProfile } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

interface PricingProps {
  plans: PlanCatalog;
}

const profileOptions: Array<{ key: PlanProfile; label: string }> = [
  { key: "personal", label: "Perfil personal" },
  { key: "business", label: "Perfil empresarial" }
];

export function Pricing({ plans }: PricingProps) {
  const [activeProfile, setActiveProfile] = useState<PlanProfile>("personal");

  useEffect(() => {
    setActiveProfile(readPlanProfilePreference());
  }, []);

  function handleProfileChange(profile: PlanProfile) {
    setActiveProfile(profile);
    writePlanProfilePreference(profile);
  }

  const activePlans = plans[activeProfile];

  return (
    <section className="soft-section relative">
      <div className="section site-shell relative z-20 py-20 text-black">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-animate="fadeInFromTop">
          <div className="plan-info text-center lg:text-left">
            <span className="type-kicker">Nuestros planes</span>
            <h2 className="type-section-title mt-4">
              Soluciones para <span className="text-secondary-500">cada perfil</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Cambia entre perfiles para comparar una ruta personal o una operacion empresarial con el mismo lenguaje del sitio.
            </p>
          </div>

          <div className="inline-flex rounded-[10px] border border-primary-500 bg-white p-1 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
            {profileOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleProfileChange(option.key)}
                className={cn(
                  "min-w-[172px] rounded-[8px] px-5 py-2 text-sm font-extrabold transition-all duration-300 lg:text-base",
                  activeProfile === option.key ? "bg-primary-500 text-white shadow-[0_12px_24px_rgba(34,74,120,0.18)]" : "text-primary-500 hover:bg-primary-50"
                )}
                aria-pressed={activeProfile === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="items grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-4">
          {activePlans.map((plan, index) => (
            <article
              key={`${activeProfile}-${plan.title}`}
              className="flex flex-col justify-between rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
              data-animate="fadeInFromBottom"
              data-delay={String(index * 0.08)}
            >
              <div className="w-full">
                <div className="mb-8">
                  <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">{plan.title}</h3>
                  <div className="my-3 h-[1px] w-[110px] bg-black" />
                  <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">{plan.price}</span>
                  {plan.subtitle ? <p className="text-base leading-6 text-slate-600">{plan.subtitle}</p> : null}
                </div>
                {plan.note ? <span className="text-sm font-medium leading-6 text-primary-500 lg:text-base lg:leading-7">{plan.note}</span> : null}
                <ul className="mb-16 mt-4 list-disc">
                  {plan.items.map((item) => (
                    <li key={item} className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/quote" className="primary-button !justify-center">
                Obtener estimado
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
