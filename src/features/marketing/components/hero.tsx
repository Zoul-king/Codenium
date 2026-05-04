import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { PageHero } from "@/features/marketing/types";

interface HeroProps {
  hero: PageHero;
}

export function Hero({ hero }: HeroProps) {
  if (hero.kind === "home") {
    return (
      <section className="section soft-section relative flex min-h-dvh items-center justify-center overflow-x-hidden pt-[114px] md:overflow-hidden">
        <div className="site-shell relative z-10 flex flex-col items-center gap-6 pb-20 pt-12 md:flex-row md:pb-[155px] lg:gap-[50px] lg:pb-[190px] lg:pt-[76px]">
          <article className="hero-text hero__content relative z-10 flex w-full flex-col items-center gap-6 text-center md:items-start md:gap-10 md:text-left" data-animate="fadeInFromLeft">
            <h1 className="type-hero-home">{hero.title}</h1>
            <p className="text-base leading-7 xl:text-xl xl:leading-9">
              <span className="font-bold text-primary-500">Codenium </span>
              {hero.body}
            </p>
            <div className="relative z-10 flex flex-row gap-4">
              <Link className="primary-button" href={hero.primaryCta.href} aria-label={hero.primaryCta.label}>
                {hero.primaryCta.label}
              </Link>
              <Link className="accent-button" href={hero.secondaryCta.href} aria-label={hero.secondaryCta.label}>
                {hero.secondaryCta.label}
              </Link>
            </div>
          </article>
          <div className="hero-image hidden max-h-[432px] w-full max-w-[432px] md:block" data-animate="fadeInFromRight">
            <HeroArtwork />
          </div>
          <SquareBackground />
        </div>
        <HeroGradients />
      </section>
    );
  }

  return (
    <section className="relative h-full w-full overflow-hidden text-white">
      {"image" in hero ? <div className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${hero.image})` }} /> : null}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(180deg,rgba(8,15,34,0.62),rgba(8,15,34,0.78))]" />
      <div className="hero relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-[186px] text-center md:py-[135px] xl:py-[240px]" data-animate="fadeIn">
        <h1 className="type-hero-inner mb-8">
          {hero.title}
          {"accent" in hero && hero.accent ? <span className="text-primary-200"> {hero.accent}</span> : null}
        </h1>
        <p className="type-hero-copy max-w-[900px] font-normal text-white md:font-light">{hero.body}</p>
      </div>
    </section>
  );
}

function HeroArtwork() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
      alt="Desarrollo web y dashboards"
      width={432}
      height={432}
      className="w-full rounded-[32px] object-cover shadow-[0_22px_60px_rgba(15,23,42,0.18)]"
      priority
    />
  );
}

function SquareBackground() {
  return (
    <div className="hero-squares" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className="hero-square" style={{ ["--square-index" as string]: index } as CSSProperties} />
      ))}
    </div>
  );
}

function HeroGradients() {
  return (
    <>
      <div className="hero-gradient hero-gradient-bottom pointer-events-none" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-bottom" />
      </div>
      <div className="hero-gradient hero-gradient-top pointer-events-none" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-top" />
      </div>
    </>
  );
}
