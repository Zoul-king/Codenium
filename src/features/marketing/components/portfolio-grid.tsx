import Image from "next/image";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { PortfolioCard } from "@/features/marketing/types";

interface PortfolioGridProps {
  cards: PortfolioCard[];
}

export function PortfolioGrid({ cards }: PortfolioGridProps) {
  return (
    <section className="projects-scroller relative mb-24 mt-4 lg:mb-32 lg:min-h-[260vh]">
      <div id="projects-container" className="site-shell portfolio-stack rounded-2xl">
        {cards.map((card, index) => (
          <article
            key={card.name}
            className="portfolio-card group/card flex flex-col justify-end p-5 md:p-6 lg:p-8"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), url(${card.image})`,
              zIndex: cards.length - index
            }}
            data-animate="fadeIn"
            data-delay={String(index * 0.03)}
          >
            <div className="portfolio-btn">
              <a href={card.href} target="_blank" rel="noreferrer" className="btn-content">
                <span className="hidden text-nowrap text-sm group-hover/card:block group-focus-within/card:block">Ver proyecto</span>
                <ArrowRightIcon className="size-4" />
              </a>
            </div>
            <div className="portfolio-info">
              {card.logo ? (
                <Image src={card.logo} alt={card.name} width={220} height={64} className="project-logo h-auto w-auto" />
              ) : (
                <div className="project-logo">{card.name}</div>
              )}
              <p className="portfolio-year">{card.year}</p>
              <p className="portfolio-text">{card.description}</p>
              <div className="portfolio-tags">
                {card.tags.map((tag) => (
                  <p key={tag} className="tag">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
