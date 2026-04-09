"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 4200;

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

function getRelativePosition(index: number, activeIndex: number, total: number) {
  const forward = (index - activeIndex + total) % total;

  if (forward === 0) return "active";
  if (forward === 1) return "next";
  if (forward === total - 1) return "prev";

  return "hidden";
}

export function PortfolioShowcase({ cards }: PortfolioShowcaseProps) {
  const resumeRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      if (resumeRef.current) {
        window.clearTimeout(resumeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused || cards.length < 2) return;

    const interval = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % cards.length);
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [cards.length, isPaused]);

  const activeCard = cards[activeIndex] ?? cards[0];

  const relatedCards = useMemo(
    () => cards.map((card, index) => ({ card, position: getRelativePosition(index, activeIndex, cards.length), index })),
    [activeIndex, cards]
  );

  function scheduleResume() {
    if (resumeRef.current) {
      window.clearTimeout(resumeRef.current);
    }

    resumeRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, AUTO_ADVANCE_MS + 1200);
  }

  function step(direction: 1 | -1) {
    setIsPaused(true);
    startTransition(() => {
      setActiveIndex((current) => (current + direction + cards.length) % cards.length);
    });
    scheduleResume();
  }

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-10 lg:py-12">
        <div className="grid gap-6 rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
          <article data-animate="fadeInFromLeft">
            <span className="type-kicker">Casos seleccionados</span>
            <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.05em] text-slate-950">
              Una tarjeta principal para entender cada caso sin exceso verbal.
            </h2>
            <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{activeCard.year}</p>
                  <h3 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.05em] text-slate-950">{activeCard.name}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{activeCard.description}</p>
              <div className="mt-4 text-sm font-medium text-slate-500">{activeCard.tags.join(" · ")}</div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {activeCard.href ? (
                  <a href={activeCard.href} target="_blank" rel="noreferrer" className="primary-button inline-flex w-fit items-center gap-2">
                    Ver proyecto
                    <ArrowRightIcon className="size-4" />
                  </a>
                ) : null}
                <Link href="/quote" className="secondary-button inline-flex w-fit items-center gap-2">
                  Quiero algo similar
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          </article>

          <div
            className="grid gap-4 lg:grid-cols-[56px_minmax(0,1fr)] lg:items-center"
            data-animate="fadeInFromRight"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => {
              setIsPaused(true);
              scheduleResume();
            }}
          >
            <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3">
              <button type="button" onClick={() => step(1)} aria-label="Proyecto anterior" className="portfolio-nav-btn">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => step(-1)} aria-label="Proyecto siguiente" className="portfolio-nav-btn">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="relative h-[24rem] overflow-hidden lg:h-[26rem] [perspective:1600px]">
              {relatedCards.map(({ card, position, index }) => {
                const stateClasses =
                  position === "active"
                    ? "z-30 translate-x-0 translate-y-0 scale-100 opacity-100"
                    : position === "prev"
                      ? "z-20 translate-x-[4rem] -translate-y-[3.8rem] scale-[0.88] opacity-60"
                      : position === "next"
                        ? "z-20 translate-x-[4rem] translate-y-[3.8rem] scale-[0.88] opacity-60"
                        : "pointer-events-none z-10 translate-x-[7rem] scale-[0.76] opacity-0";

                return (
                  <button
                    key={card.name}
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      startTransition(() => setActiveIndex(index));
                      scheduleResume();
                    }}
                    className={cn(
                      "group absolute left-0 top-1/2 block h-[11rem] w-[20rem] max-w-[84vw] -translate-y-1/2 overflow-hidden rounded-[30px] border border-white/20 text-left text-white shadow-[0_24px_45px_rgba(15,23,42,0.16)] will-change-transform transition-[transform,opacity,box-shadow] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:w-[25rem]",
                      stateClasses,
                      position === "active" ? "h-[14rem] shadow-[0_32px_55px_rgba(15,23,42,0.24)]" : "hover:scale-[0.9]"
                    )}
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 1024px) 84vw, 25rem"
                      className={cn(
                        "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        position === "active" ? "scale-100 group-hover:scale-105" : "scale-110 saturate-[0.85]"
                      )}
                    />
                    <div className={cn("absolute inset-0", position === "active" ? "bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.72))]" : "bg-[linear-gradient(180deg,rgba(15,23,42,0.24),rgba(15,23,42,0.8))]")} />
                    <div className="relative flex h-full flex-col justify-end p-5 lg:p-6">
                      <h3 className={cn("font-semibold tracking-[-0.04em] text-white", position === "active" ? "text-[1.9rem]" : "text-[1.2rem]")}>{card.name}</h3>
                      <p className={cn("mt-2 text-white/80", position === "active" ? "text-sm" : "text-[0.78rem]")}>{card.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between lg:hidden">
              <button type="button" onClick={() => step(1)} aria-label="Proyecto anterior" className="portfolio-nav-btn">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => step(-1)} aria-label="Proyecto siguiente" className="portfolio-nav-btn">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
