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
          <span className="font-semibold uppercase tracking-[0.18em] text-secondary-600">Proyectos desarrollados</span>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-slate-950 lg:text-[42px]">
            Proyectos que se <span className="text-secondary-600">recorren</span> como un flujo continuo
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Reemplazamos el bloque anterior por una composicion conectada: el contenido cambia junto con la visual para presentar cada software sin depender de un slider generico.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]" data-animate="fadeInFromBottom">
          <article className="portfolio-story-card flex min-h-full flex-col">
            <div key={activeCard.name} className="portfolio-story-copy flex min-h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-[32px] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 lg:text-[46px]">{activeCard.name}</h3>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 lg:text-base">{activeCard.description}</p>
                  <div className="mt-5 grid gap-2 text-sm leading-6 text-slate-600">
                    <p>Enfoque principal: {activeCard.tags[0] ?? "Producto digital"}</p>
                    <p>Resultado visible: {activeCard.tags[1] ?? "Experiencia mas clara para el usuario"}</p>
                    <p>Escala del proyecto: {activeCard.tags[2] ?? "Implementacion lista para crecer"}</p>
                  </div>
                </div>

                {activeCard.logo ? <Image src={activeCard.logo} alt={`${activeCard.name} logo`} width={144} height={48} className="h-10 w-auto shrink-0 object-contain lg:h-12" /> : null}
              </div>

              <div className="mt-auto pt-8">
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/quote#quote-form" className="primary-button">
                    Cotizar proyecto similar
                  </Link>
                  <a
                    href={activeCard.href ?? "#"}
                    target={activeCard.href ? "_blank" : undefined}
                    rel={activeCard.href ? "noreferrer" : undefined}
                    className="accent-button inline-flex items-center gap-2"
                  >
                    Visitar sitio
                    <ArrowRightIcon className="size-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-2 border-t border-slate-200 pt-5">
              {cards.map((card, index) => (
                <button
                  key={card.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center justify-between gap-4 border-b border-slate-200 py-3 text-left transition",
                    index === activeIndex ? "text-slate-950" : "text-slate-500 hover:text-slate-900"
                  )}
                  aria-pressed={index === activeIndex}
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.14em]">{card.name}</span>
                  <span className={cn("h-px flex-1 transition", index === activeIndex ? "bg-secondary-500" : "bg-slate-200")} />
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
