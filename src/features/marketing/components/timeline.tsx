import Image from "next/image";

import { site } from "@/features/marketing/data/site";
import type { TimelineStep } from "@/features/marketing/types";

interface TimelineProps {
  steps: TimelineStep[];
}

const desktopOffsets = [
  "lg:mr-auto lg:max-w-[420px] lg:pl-4",
  "lg:ml-auto lg:mt-20 lg:max-w-[420px] lg:pr-4",
  "lg:mr-auto lg:mt-[-18px] lg:max-w-[420px] lg:pl-4",
  "lg:ml-auto lg:mt-20 lg:max-w-[420px] lg:pr-4",
  "lg:mr-auto lg:mt-[-18px] lg:max-w-[420px] lg:pl-4",
  "lg:ml-auto lg:mt-20 lg:max-w-[420px] lg:pr-4",
  "lg:mr-auto lg:mt-[-18px] lg:max-w-[420px] lg:pl-4"
];

export function Timeline({ steps }: TimelineProps) {
  return (
    <section className="soft-section relative overflow-hidden bg-foreground">
      <div className="timeline section site-shell relative z-20 py-14 text-center lg:py-20">
        <span className="font-semibold uppercase tracking-[0.18em] text-purple-600" data-animate="fadeIn">
          Nuestro proceso de trabajo
        </span>
        <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]" data-animate="fadeIn">
          Como lo <span className="text-secondary-500">hacemos</span>?
        </h2>

        <div className="relative mx-auto mt-14 max-w-[980px] lg:mt-20">
          <svg className="pointer-events-none absolute left-7 top-14 h-[calc(100%-7rem)] w-8 lg:hidden" viewBox="0 0 32 1200" fill="none" preserveAspectRatio="none">
            <path d="M16 20 C8 120 24 200 16 300 C8 400 24 480 16 580 C8 680 24 760 16 860 C8 960 24 1040 16 1140" stroke="url(#timeline-mobile-gradient)" strokeWidth="2" strokeDasharray="8 12" strokeLinecap="round" opacity="0.5" />
            <defs>
              <linearGradient id="timeline-mobile-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f2f96" />
                <stop offset="100%" stopColor="#68b8b2" />
              </linearGradient>
            </defs>
          </svg>

          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 980 1560" fill="none" preserveAspectRatio="none">
            <path
              d="M250 110 C430 110 540 110 724 246 C810 310 808 420 718 474 C546 578 436 560 256 660 C160 714 168 826 262 888 C432 998 550 982 722 1084 C812 1138 808 1254 716 1314 C538 1430 424 1410 248 1498"
              stroke="url(#timeline-desktop-gradient)"
              strokeWidth="2.5"
              strokeDasharray="10 14"
              strokeLinecap="round"
              opacity="0.45"
            />
            <defs>
              <linearGradient id="timeline-desktop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f2f96" />
                <stop offset="100%" stopColor="#68b8b2" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-10 lg:gap-0">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative flex flex-col items-start gap-4 pl-16 text-left lg:pl-0 ${desktopOffsets[index] ?? ""}`}
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="relative h-[154px] w-[154px] rounded-full border border-slate-200 bg-white p-2 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
                  <Image src={site.assets.timeline[index]} alt={`Paso ${index + 1}`} width={138} height={138} className="h-[138px] w-[138px] rounded-full object-cover" />
                  <span className="absolute bottom-1 right-1 inline-grid size-[48px] place-content-center rounded-full bg-primary-500 text-lg font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[280px] text-lg font-semibold leading-6 text-slate-900 lg:max-w-[320px] lg:text-[1.5rem] lg:leading-8">{step.title}</span>
                <p className="max-w-[320px] text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
