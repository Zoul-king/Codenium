import Image from "next/image";

import { site } from "@/features/marketing/data/site";
import type { TimelineStep } from "@/features/marketing/types";

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  return (
    <section className="soft-section relative overflow-hidden bg-foreground">
      <div className="timeline section site-shell relative z-20 py-14 text-center lg:py-20">
        <span className="type-kicker" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="type-section-title mt-4" data-animate="fadeIn">
          ¿Cómo lo <span className="text-secondary-500">hacemos</span>?
        </h2>
        <div className="relative mx-auto mt-8 max-w-[820px]">
          <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 border-l border-dashed border-black/40 lg:block" />
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative flex flex-col items-center gap-4 text-center lg:max-w-[300px] ${index % 2 === 0 ? "lg:justify-self-start lg:pr-8" : "lg:justify-self-end lg:pl-8"} ${index % 2 === 0 ? "lg:mt-0" : "lg:mt-10"}`}
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="relative h-[150px] w-[150px] rounded-full border border-primary-400 bg-white p-1.5">
                  <Image src={site.assets.timeline[index]} alt={`Paso ${index + 1}`} width={136} height={136} className="h-[136px] w-[136px] rounded-full" />
                  <span className="absolute bottom-0 right-0 inline-grid size-[52px] place-content-center rounded-full bg-primary-500 text-[28px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[280px] text-base font-bold leading-5 lg:text-[1.75rem] lg:leading-7">{step.title}</span>
                <p className="max-w-[280px] text-sm leading-[26px] text-body-color lg:text-base lg:leading-7">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
