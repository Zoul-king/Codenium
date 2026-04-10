"use client";

import Link from "next/link";

import type { ServicePricingItem } from "@/features/marketing/types";
import { buildContactSelectionHref, writeQuoteSelection } from "@/lib/quote-selection";

interface ServicesPricingProps {
  items: ServicePricingItem[];
}

export function ServicesPricing({ items }: ServicesPricingProps) {
  return (
    <section className="soft-section relative">
      <div className="section site-shell relative z-20 py-20 text-black">
        <div className="mb-12 text-center lg:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker-accent">Nuestros servicios</span>
          <h2 className="type-section-title mt-4">Como podemos ayudarte?</h2>
        </div>

        <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="flex flex-col justify-between rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
              data-animate="fadeInFromBottom"
              data-delay={String(index * 0.08)}
            >
              <div>
                <div className="mb-8">
                  <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">{item.title}</h3>
                  <div className="my-3 h-[1px] w-[110px] bg-black" />
                  <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">{item.price}</span>
                  <p className="text-base leading-6 text-slate-600">{item.subtitle}</p>
                </div>
                <p className="text-sm leading-7 text-slate-600 lg:text-base lg:leading-7">{item.description}</p>
              </div>

              <Link
                href={buildContactSelectionHref({ source: "service", label: item.title })}
                className="accent-button-solid mt-10 !justify-center"
                onClick={() => writeQuoteSelection({ source: "service", label: item.title })}
              >
                Solicitar servicio
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
