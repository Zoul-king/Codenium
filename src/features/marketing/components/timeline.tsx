import Image from "next/image";

import { site } from "@/features/marketing/data/site";
import type { TimelineStep } from "@/features/marketing/types";

interface TimelineProps {
  steps: TimelineStep[];
}

const desktopCardClasses = [
  "lg:justify-self-start lg:pr-20",
  "lg:justify-self-end lg:pt-24 lg:pl-20",
  "lg:justify-self-start lg:-mt-6 lg:pr-20",
  "lg:justify-self-end lg:pt-24 lg:pl-20",
  "lg:justify-self-start lg:-mt-6 lg:pr-20",
  "lg:justify-self-end lg:pt-24 lg:pl-20",
  "lg:justify-self-start lg:-mt-6 lg:pr-20"
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

        <div className="relative mx-auto mt-16 max-w-[1120px] lg:mt-24">
          <svg className="pointer-events-none absolute left-[75px] top-[52px] h-[calc(100%-9rem)] w-10 lg:hidden" viewBox="0 0 40 1400" fill="none" preserveAspectRatio="none">
            <path
              d="M20 24 C20 120 20 180 20 276 C20 372 20 432 20 528 C20 624 20 684 20 780 C20 876 20 936 20 1032 C20 1128 20 1188 20 1284"
              stroke="url(#timeline-mobile-gradient)"
              strokeWidth="2.5"
              strokeDasharray="8 14"
              strokeLinecap="round"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="timeline-mobile-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f2f96" />
                <stop offset="100%" stopColor="#68b8b2" />
              </linearGradient>
            </defs>
          </svg>

          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1120 1680" fill="none" preserveAspectRatio="none">
            <path
              d="M230 118
                 C400 118 510 118 700 260
                 C814 346 812 458 694 520
                 C510 618 396 596 232 728
                 C146 798 154 918 246 972
                 C420 1072 530 1048 704 1196
                 C816 1290 816 1404 696 1468
                 C518 1564 404 1548 230 1624"
              stroke="url(#timeline-desktop-gradient)"
              strokeWidth="3"
              strokeDasharray="10 16"
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

          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-y-0">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative flex max-w-[420px] flex-col items-start gap-4 pl-[124px] text-left lg:pl-0 ${desktopCardClasses[index] ?? ""}`}
                data-animate="fadeInFromBottom"
                data-delay={String(index * 0.05)}
              >
                <div className="absolute left-0 top-0 lg:static">
                  <div className="relative h-[154px] w-[154px] rounded-full border border-slate-200 bg-white p-2 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
                    <Image src={site.assets.timeline[index]} alt={`Paso ${index + 1}`} width={138} height={138} className="h-[138px] w-[138px] rounded-full object-cover" />
                    <span className="absolute bottom-1 right-1 inline-grid size-[48px] place-content-center rounded-full bg-primary-500 text-lg font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <span className="max-w-[280px] pt-2 text-lg font-semibold leading-6 text-slate-900 lg:max-w-[320px] lg:pt-0 lg:text-[1.5rem] lg:leading-8">
                  {step.title}
                </span>
                <p className="max-w-[320px] text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
