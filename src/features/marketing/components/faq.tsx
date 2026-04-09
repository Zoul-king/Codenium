"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { site } from "@/features/marketing/data/site";
import type { FaqItem } from "@/features/marketing/types";

interface FaqProps {
  items: FaqItem[];
}

export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-primary-200/50 blur-3xl" aria-hidden="true" />
      <div className="site-shell px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-16 lg:py-16">
        <div className="faqs-info mb-10 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Dudas frecuentes</span>
          <h2 className="type-section-title mt-4">
            Preguntas mas <span className="text-secondary-500">frecuentes</span>
          </h2>
        </div>
        <div className="flex flex-col items-start justify-center gap-8 sm:flex-row lg:gap-12">
          <div className="h-full w-full lg:max-w-[620px]">
            {items.map((item, index) => (
              <article key={item.question} className="mb-4 last:mb-0">
                <div className="accordion" data-open={openIndex === index} data-animate="fadeInFromBottomSm" data-delay={String(index * 0.04)}>
                  <button type="button" className="accordion__title" onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}>
                    <span>{item.question}</span>
                    <ChevronDown className="arrow" strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <div className="details__content">
                    <div className="overflow-hidden">
                      <p className="accordion__description">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="faqs-image w-full" data-animate="fadeInFromRight" data-delay="0.18">
            <div className="relative h-[430px] w-full">
              <Image src={site.assets.faq} alt="Preguntas frecuentes" fill className="h-full w-full object-contain object-center" sizes="516px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
