import Image from "next/image";

import { site } from "@/features/marketing/data/site";

interface StoryProps {
  paragraphs: string[];
}

export function Story({ paragraphs }: StoryProps) {
  return (
    <section className="section soft-section bg-foreground">
      <div className="site-shell flex flex-col gap-10 py-10 md:flex-row md:items-center md:gap-[50px] xl:py-[71px]">
        <article className="about-info flex w-full flex-col gap-4 text-center text-sm leading-6 md:text-left lg:text-base lg:leading-7" data-animate="fadeInFromLeft">
          <span className="type-kicker">Sobre nosotros</span>
          <h2 className="type-section-title">
            Conoce nuestra <span className="text-secondary-500">historia</span>
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
        <div className="about-image hidden w-full md:block" data-animate="fadeInFromRight">
          <Image src={site.assets.about.story} alt="Historia de AxolotlCode" width={548} height={548} className="h-auto w-full" sizes="548px" />
        </div>
      </div>
    </section>
  );
}
