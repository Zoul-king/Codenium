"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 4200;

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

function getDisplayLink(href: string | undefined) {
  if (!href) {
    return "Proyecto destacado";
  }

  return href.replace("https://", "").replace("http://", "").replace("www.", "").split("?")[0];
}

function getRelativePosition(index: number, activeIndex: number, total: number) {
  const forward = (index - activeIndex + total) % total;

  if (forward === 0) {
    return "active";
  }

  if (forward === 1) {
    return "next";
  }

  if (forward === total - 1) {
    return "prev";
  }

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
    if (isPaused || cards.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
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
    }, AUTO_ADVANCE_MS + 1400);
  }

  function step(direction: 1 | -1) {
    setIsPaused(true);
    setActiveIndex((current) => (current + direction + cards.length) % cards.length);
    scheduleResume();
  }

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-14">
          <article
            className="rounded-[28px] border border-white bg-gradient-to-br from-white to-white/80 p-6 shadow-[0_18px_44px_rgba(14,20,36,0.08)] lg:p-8"
            data-animate="fadeInFromLeft"
          >
            <span className="type-kicker">Casos seleccionados</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-body-color lg:text-[2.35rem]">
              Soluciones pensadas para operar mejor, vender mejor o avanzar más rápido
            </h2>
            <p className="type-body mt-4">
              Cada proyecto parte de una necesidad distinta, pero todos comparten la misma intención: dar claridad al
              negocio, ordenar el producto y dejar una base lista para crecer.
            </p>

            <div className="mt-8 rounded-[22px] border border-primary-100 bg-foreground p-5 shadow-[0_10px_20px_rgba(14,20,36,0.05)]">
              <div className="flex items-start justify-between gap-4 border-b border-primary-100 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-600">Proyecto activo</p>
                  <h3 className="mt-3 text-[1.65rem] font-bold leading-tight text-body-color">{activeCard.name}</h3>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-600">
                  {activeCard.year}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-body-color">{activeCard.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeCard.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-semibold text-body-color">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-primary-100 pt-5 sm:flex-row">
                {activeCard.href ? (
                  <a
                    href={activeCard.href}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-button inline-flex w-fit items-center gap-2"
                  >
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
            className="grid gap-4 lg:grid-cols-[56px_minmax(0,1fr)] lg:items-center lg:pl-10"
            data-animate="fadeInFromRight"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => {
              setIsPaused(true);
              scheduleResume();
            }}
          >
            <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3">
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Proyecto anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 transition hover:border-primary-500 hover:bg-primary-500 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Proyecto siguiente"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 transition hover:border-primary-500 hover:bg-primary-500 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="relative h-[27rem] overflow-hidden lg:h-[31rem]">
              {relatedCards.map(({ card, position, index }) => {
                const stateClasses =
                  position === "active"
                    ? "translate-x-0 -translate-y-[1rem] scale-100 opacity-100 z-30"
                    : position === "prev"
                      ? "translate-x-[7rem] -translate-y-[9.2rem] scale-[0.74] opacity-65 z-20"
                      : position === "next"
                        ? "translate-x-[7rem] translate-y-[9.2rem] scale-[0.74] opacity-65 z-20"
                        : "translate-x-[11rem] scale-[0.58] opacity-0 z-10";

                return (
                  <button
                    key={card.name}
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      setActiveIndex(index);
                      scheduleResume();
                    }}
                    className={cn(
                      "absolute left-0 top-1/2 block h-[11.2rem] w-[20.75rem] max-w-[84vw] -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/15 px-5 py-5 text-left text-white shadow-[0_20px_38px_rgba(15,23,32,0.18)] transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      stateClasses,
                      position === "active"
                        ? "h-[14.5rem] w-[25.75rem] bg-[linear-gradient(135deg,#4f2f96_0%,#6c4fd3_56%,#68c3cf_100%)] shadow-[0_28px_48px_rgba(15,23,32,0.24)]"
                        : "bg-[linear-gradient(135deg,#51348f_0%,#5f45b9_58%,#4aaab7_100%)]"
                    )}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/74">
                          {card.tags[0]}
                        </p>
                        <h3 className={cn("mt-3 font-semibold tracking-[-0.04em] text-white", position === "active" ? "text-[1.86rem]" : "text-[1.32rem]")}>
                          {card.name}
                        </h3>
                      </div>
                      <p className={cn("text-white/82", position === "active" ? "text-sm" : "text-[0.76rem]")}>{getDisplayLink(card.href)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Proyecto anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Proyecto siguiente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600"
              >
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
