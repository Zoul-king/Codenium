"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

const rotationIntervalMs = 4800;

export function PortfolioShowcase({ cards }: PortfolioShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (cards.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, rotationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [cards.length]);

  if (cards.length === 0) {
    return null;
  }

  const activeCard = cards[activeIndex];

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-24">
        <div className="mb-12 flex flex-col items-start gap-4" data-animate="fadeInFromTop">
          <span className="font-semibold uppercase tracking-[0.18em] text-primary-500">Portafolio activo</span>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-slate-950 lg:text-[42px]">
            Proyectos que se <span className="text-secondary-600">recorren</span> como un flujo continuo
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Reemplazamos el bloque anterior por una composicion conectada: el contenido cambia junto con la visual para presentar cada software sin depender de un slider generico.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]" data-animate="fadeInFromBottom">
          <article className="portfolio-story-card">
            <div key={activeCard.name} className="portfolio-story-copy">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600">{activeCard.year}</span>
                {activeCard.logo ? <Image src={activeCard.logo} alt={`${activeCard.name} logo`} width={120} height={40} className="h-7 w-auto object-contain" /> : null}
              </div>

              <h3 className="mt-6 text-[32px] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 lg:text-[46px]">{activeCard.name}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 lg:text-base">{activeCard.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {activeCard.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/quote" className="primary-button">
                  Cotizar
                </Link>
                <a
                  href={activeCard.href ?? "#"}
                  target={activeCard.href ? "_blank" : undefined}
                  rel={activeCard.href ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-primary-300 hover:text-primary-500"
                >
                  Visitar sitio
                  <ArrowRightIcon className="size-4" />
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {cards.map((card, index) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    index === activeIndex ? "border-primary-500 bg-primary-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-500"
                  )}
                  aria-pressed={index === activeIndex}
                >
                  {card.name}
                </button>
              ))}
            </div>
          </article>

          <article className="portfolio-visual-card">
            <div className="portfolio-visual-stage" aria-label={`Visual principal de ${activeCard.name}`}>
              {cards.map((card, index) => {
                const relativeIndex = (index - activeIndex + cards.length) % cards.length;

                return (
                  <div
                    key={card.name}
                    className={cn(
                      "portfolio-visual-layer",
                      relativeIndex === 0 ? "is-active" : null,
                      relativeIndex === 1 ? "is-next" : null,
                      relativeIndex === 2 ? "is-third" : null,
                      relativeIndex > 2 ? "is-hidden" : null
                    )}
                  >
                    <Image src={card.image} alt={card.name} fill sizes="(min-width: 1280px) 52vw, 100vw" className="object-cover" priority={index === 0} />
                    <div className="portfolio-visual-overlay" />
                    <div className="portfolio-visual-meta">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78">Proyecto activo</p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{card.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
