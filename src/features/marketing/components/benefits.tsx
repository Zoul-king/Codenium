import Image from "next/image";

import { CheckIcon } from "@/components/ui/icons";
import { site } from "@/features/marketing/data/site";
import type { BenefitItem } from "@/features/marketing/types";

interface BenefitsProps {
  items: BenefitItem[];
}

export function Benefits({ items }: BenefitsProps) {
  return (
    <section className="soft-section relative w-full">
      <div className="section site-shell relative z-20 flex min-h-[70vh] flex-col items-center gap-x-5 gap-y-[50px] py-16 sm:flex-row lg:gap-[50px]">
        <div className="grid w-full grid-cols-1 gap-5 min-[900px]:grid-cols-2">
          {site.assets.gallery.map((image, index) => (
            <div
              key={image}
              className={`relative h-full min-h-[199px] w-full overflow-hidden rounded-[10px] transition-transform hover:scale-[1.02] ${index === 1 ? "block" : "hidden min-[900px]:block"}`}
              data-animate="fadeIn"
              data-delay={String(index * 0.12)}
            >
              <Image src={image} alt="Vista del trabajo de AxolotlCode" fill className="object-cover" sizes="(min-width: 900px) 285px, 100vw" />
            </div>
          ))}
        </div>
        <article className="flex w-full flex-col items-start text-left" data-animate="fadeIn">
          <div className="mb-3 flex flex-col gap-4">
            <span className="type-kicker">¿Por qué AxolotlCode?</span>
            <h2 className="type-section-title">
              En AxolotlCode construimos <span className="text-secondary-500">más que software</span>
            </h2>
            <p className="max-w-2xl text-sm text-body-color sm:text-base">
              Creamos soluciones que impulsan tu negocio hacia el éxito. Nuestro equipo combina innovación, calidad y compromiso para desarrollar herramientas tecnológicas personalizadas.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-1">
            {items.map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-lg p-2 transition-colors duration-300 hover:bg-primary-500/10 md:p-1">
                <div className="p-2 text-secondary-500">
                  <CheckIcon />
                </div>
                <span className="text-[16px] font-bold text-gray-700 sm:text-sm lg:text-base">
                  {item.title}: <span className="font-normal">{item.body}</span>
                </span>
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
