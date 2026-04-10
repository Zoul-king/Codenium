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
        <span className="font-semibold uppercase tracking-[0.18em] text-purple-600" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]" data-animate="fadeIn">
          ¿Cómo lo <span className="text-secondary-500">hacemos</span>?
        </h2>
        <div className="relative mx-auto mt-[100px] max-w-[1120px]">
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 1120 1200" // Adjusted viewBox to match the container
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M160 80 Q 560 80 560 200 T 960 260 T 160 480 T 960 620 T 160 840 T 960 980"
              stroke="url(#timeline-gradient)"
              strokeWidth="2"
              strokeDasharray="8 12"
              strokeLinecap="round"
              className="opacity-40"
            />
            <defs>
              <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#224a78" />
                <stop offset="100%" stopColor="#68b8b2" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative flex flex-col items-center gap-4 text-center lg:max-w-[320px] ${index % 2 === 0 ? "lg:justify-self-start lg:pr-10" : "lg:justify-self-end lg:pl-10"} ${index % 2 === 0 ? "lg:mt-0" : "lg:mt-14"}`}
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="relative h-[154px] w-[154px] rounded-full border border-slate-200 bg-white p-2 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
                  <Image src={site.assets.timeline[index]} alt={`Paso ${index + 1}`} width={138} height={138} className="h-[138px] w-[138px] rounded-full object-cover" />
                  <span className="absolute bottom-1 right-1 inline-grid size-[48px] place-content-center rounded-full bg-primary-500 text-lg font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[280px] text-lg font-semibold leading-6 text-slate-900 lg:text-[1.5rem] lg:leading-8">{step.title}</span>
                <p className="max-w-[280px] text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
