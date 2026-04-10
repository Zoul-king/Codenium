import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

export function PortfolioShowcase({ cards }: PortfolioShowcaseProps) {
  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-24">
        <div className="mb-12 flex flex-col items-start gap-4" data-animate="fadeInFromTop">
          <span className="font-semibold uppercase tracking-[0.18em] text-primary-500">Software desarrollados</span>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-slate-950 lg:text-[42px]">
            Una grilla de <span className="text-secondary-600">soluciones</span> pensada para leer casos reales
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Sustituimos el carrusel por una solutions grid integrada al sitio: tarjetas modulares, jerarquia clara y contexto rapido para entender cada software.
          </p>
        </div>

        <div className="solutions-grid" data-animate="fadeInFromBottom">
          {cards.map((card, index) => (
            <article key={card.name} className={`solutions-card ${index === 0 ? "md:col-span-2 xl:col-span-2" : ""}`}>
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#224a78_0%,#68b8b2_100%)]" aria-hidden="true" />
              <div className={`grid gap-6 ${index === 0 ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600">{card.year}</span>
                    {card.logo ? <Image src={card.logo} alt={`${card.name} logo`} width={96} height={36} className="h-7 w-auto object-contain" /> : null}
                  </div>
                  <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.04em] text-slate-950 lg:text-[30px]">{card.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">{card.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {card.href ? (
                      <a href={card.href} target="_blank" rel="noreferrer" className="primary-button text-sm">
                        Ver proyecto
                      </a>
                    ) : null}
                    <Link href="/quote" className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary-300 hover:text-primary-500">
                      Quiero algo similar
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </div>
                </div>

                <div className={`relative overflow-hidden rounded-[24px] ${index === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Image src={card.image} alt={card.name} fill className="object-cover" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
