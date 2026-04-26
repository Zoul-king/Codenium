import Image from "next/image";

import { CheckIcon } from "@/components/common/icons";
import { site } from "@/features/marketing/data/site";
import type { BenefitItem } from "@/features/marketing/types";

interface BenefitsProps {
  items: BenefitItem[];
}

export function Benefits({ items }: BenefitsProps) {
  return (
    <section className="soft-section relative w-full">
      <div className="section site-shell relative z-20 flex min-h-[70vh] flex-col items-center gap-x-5 gap-y-10 py-16 sm:flex-row lg:gap-[50px]">
        <div className="grid w-full grid-cols-1 gap-5 min-[900px]:grid-cols-2">
          {site.assets.gallery.map((image, index) => (
            <div
              key={image}
              className={`relative h-full min-h-[199px] w-full overflow-hidden rounded-[10px] transition-transform hover:scale-[1.02] ${index === 1 ? "block" : "hidden min-[900px]:block"}`}
              data-animate="fadeIn"
              data-delay={String(index * 0.12)}
            >
              <Image src={image} alt="Vista del trabajo de Codenium" fill className="object-cover" sizes="(min-width: 900px) 285px, 100vw" />
            </div>
          ))}
        </div>
        <article className="flex w-full flex-col items-start text-left" data-animate="fadeIn">
          <div className="mb-5 flex flex-col gap-3">
            <span className="type-kicker-accent">Por que Codenium?</span>
            <h2 className="type-section-title">
              Construimos <span className="text-secondary-500">mas que software</span>
            </h2>
          </div>
          <div className="grid w-full grid-cols-1 gap-1">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-3 py-2.5">
                <div className="mt-1 shrink-0 text-secondary-500">
                  <CheckIcon />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[17px] font-bold text-slate-900">{item.title}</span>
                  <p className="text-sm leading-relaxed text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
      <svg width="407" height="598" viewBox="0 0 407 598" fill="none" className="absolute top-0 z-10 w-full">
        <g filter="url(#benefit-glow)">
          <circle cx="52.651" cy="293.651" r="153.475" transform="rotate(-30 52.651 293.651)" fill="#B1E7E8" />
        </g>
        <defs>
          <filter id="benefit-glow" x="-300.85" y="-59.8498" width="707.002" height="707.002" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_4040_2295" />
          </filter>
        </defs>
      </svg>
    </section>
  );
}
