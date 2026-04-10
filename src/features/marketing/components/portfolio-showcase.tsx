"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";

interface PortfolioShowcaseProps {
  cards: PortfolioCard[];
}

export function PortfolioShowcase({ cards }: PortfolioShowcaseProps) {
  const featured = cards[0];
  const others = cards.slice(1, 5); // Take up to 4 more

  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell py-16 lg:py-24">
        <div className="mb-12 flex flex-col items-start gap-4" data-animate="fadeInFromTop">
          <span className="font-semibold uppercase tracking-[0.18em] text-purple-600">Casos de éxito</span>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-slate-950 lg:text-[42px]">
            Proyectos que han <span className="text-primary-500">transformado</span> negocios
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Una selección de soluciones digitales donde el diseño y la tecnología se unieron para resolver problemas reales.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" data-animate="fadeInFromBottom">
          {/* Featured Project */}
          <article className="group relative flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-950 lg:text-3xl">{featured.name}</h3>
                <span className="text-sm font-bold text-primary-500">{featured.year}</span>
              </div>
              <p className="mb-8 line-clamp-2 text-sm leading-relaxed text-slate-600 lg:text-base">
                {featured.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-4">
                {featured.href && (
                  <a href={featured.href} target="_blank" rel="noreferrer" className="primary-button text-sm">
                    Ver proyecto
                  </a>
                )}
                <Link href="/quote" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100">
                  Quiero algo similar
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Side Grid of Others */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Otros proyectos recientes</h4>
            <div className="grid gap-6 sm:grid-cols-1">
              {others.map((card) => (
                <article key={card.name} className="group relative flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-3 pr-6 shadow-sm transition-all hover:shadow-md">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px]">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">{card.year}</span>
                    <h5 className="font-bold text-slate-950">{card.name}</h5>
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                  </div>
                  <Link href="/contact" className="absolute inset-0 z-10" />
                </article>
              ))}
              <Link href="/contact" className="group flex items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-slate-200 p-8 text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-500">
                <span className="text-sm font-bold">Ver más proyectos</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

