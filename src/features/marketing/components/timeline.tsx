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
        <span className="font-semibold uppercase tracking-[0.18em] text-accent-500" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]" data-animate="fadeIn">
          Como lo <span className="text-secondary-500">hacemos</span>?
        </h2>

        <div className="mx-auto mt-16 max-w-[1120px] lg:mt-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="flex h-full flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-[0_16px_36px_rgba(15,23,42,0.06)] lg:p-7"
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="flex items-start gap-5">
                  <div className="relative h-[120px] w-[120px] shrink-0 rounded-full border border-slate-200 bg-slate-50 p-2 shadow-[0_12px_26px_rgba(15,23,42,0.07)] sm:h-[132px] sm:w-[132px]">
                    <Image src={site.assets.timeline[index]} alt={`Paso ${index + 1}`} width={138} height={138} className="h-full w-full rounded-full object-cover" />
                    <span className="absolute bottom-1 right-1 inline-grid size-[42px] place-content-center rounded-full bg-primary-500 text-sm font-bold text-white sm:size-[46px] sm:text-base">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="min-w-0 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Paso {String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-3 block text-xl font-semibold leading-7 text-slate-900 lg:text-[1.45rem] lg:leading-8">{step.title}</span>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-600 lg:text-base">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
