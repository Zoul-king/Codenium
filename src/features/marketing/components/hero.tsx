import Image from "next/image";
import Link from "next/link";

import type { PageHero } from "@/features/marketing/types";

interface HeroProps {
  hero: PageHero;
}

export function Hero({ hero }: HeroProps) {
  if (hero.kind === "home") {
    return (
      <section className="section soft-section relative flex min-h-dvh items-center justify-center overflow-hidden pt-[114px]">
        <div className="site-shell background__waves relative flex flex-col items-center gap-6 pb-[155px] pt-12 md:flex-row lg:gap-[50px] lg:pb-[190px] lg:pt-[76px]">
          <article className="hero-text hero__content flex w-full flex-col items-center gap-6 text-center md:items-start md:gap-10 md:text-left" data-animate="fadeInFromLeft">
            <h1 className="type-hero-home">{hero.title}</h1>
            <p className="text-base leading-7 xl:text-xl xl:leading-9">
              <span className="font-bold text-primary-500">AxolotlCode </span>
              {hero.body.replace(/^En AxolotlCode\s*/, "")}
            </p>
            <div className="flex flex-row gap-4">
              <Link className="primary-button" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Link>
              <Link className="secondary-button" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </Link>
            </div>
          </article>
          <div className="hero-image hidden max-h-[432px] w-full max-w-[432px] md:block" data-animate="fadeInFromRight">
            <HeroArtwork />
          </div>
          <OrbBackground />
        </div>
        <HeroGradients />
      </section>
    );
  }

  if (hero.kind === "portfolio") {
    return (
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0">
          <PortfolioGradients />
        </div>
        <div className="site-shell">
          <h1 className="type-hero-portfolio" data-animate="fadeIn">
            {hero.title}
          </h1>
          <p className="type-body mx-auto mb-16 max-w-4xl text-center lg:mb-24" data-animate="fadeIn" data-delay="0.1">
            {hero.body}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-full w-full text-white">
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.image})` }}
      />
      <div className="absolute inset-0 h-full w-full bg-black/75" />
      <div className="hero relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-[186px] text-center md:py-[135px] xl:py-[276px]" data-animate="fadeIn">
        <h1 className="type-hero-inner mb-8">
          {hero.title}
          {hero.accent ? <span className="text-primary-200"> {hero.accent}</span> : null}
        </h1>
        <p className="type-hero-copy max-w-[900px] font-normal text-white md:font-light">{hero.body}</p>
      </div>
    </section>
  );
}

function HeroArtwork() {
  return <Image src="/images/marketing/hero-home.webp" alt="AxolotlCode" width={432} height={432} className="w-full" priority />;
}

function OrbBackground() {
  return (
    <div className="background">
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function HeroGradients() {
  return (
    <>
      <div className="hero-gradient hero-gradient-bottom" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-bottom" />
      </div>
      <div className="hero-gradient hero-gradient-top" aria-hidden="true">
        <div className="hero-gradient-shape hero-gradient-shape-top" />
      </div>
    </>
  );
}

function PortfolioGradients() {
  return (
    <>
      <svg width="910" height="678" viewBox="0 0 910 678" fill="none" className="fixed -top-70 -z-10 blur-2xl">
        <rect
          opacity="0.3"
          x="-90.6299"
          y="-243.33"
          width="1155"
          height="677.995"
          transform="rotate(30 -90.6299 -243.33)"
          fill="url(#portfolio-gradient-left)"
        />
        <defs>
          <linearGradient id="portfolio-gradient-left" x1="190.872" y1="599.909" x2="782.863" y2="-408.578" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF80B5" />
            <stop offset="1" stopColor="#9089FC" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="1504" height="806" viewBox="0 0 1504 806" fill="none">
        <rect opacity="0.3" x="718.5" y="64" width="1155" height="678" fill="url(#portfolio-gradient-right)" />
        <defs>
          <linearGradient id="portfolio-gradient-right" x1="1000" y1="907.245" x2="1592" y2="-101.245" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF80B5" />
            <stop offset="1" stopColor="#9089FC" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
