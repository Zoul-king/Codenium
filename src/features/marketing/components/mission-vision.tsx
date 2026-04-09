import Image from "next/image";

import { site } from "@/features/marketing/data/site";
import type { AboutBlock } from "@/features/marketing/types";

interface MissionVisionProps {
  items: AboutBlock[];
}

export function MissionVision({ items }: MissionVisionProps) {
  return (
    <section className="soft-section bg-foreground">
      <div className="section site-shell flex flex-col items-center gap-x-[40px] gap-y-2.5 py-10 sm:flex-row xl:py-[66px] 2xl:py-[80px]">
        <div className="company-image grid w-full place-content-center" data-animate="fadeInFromLeft">
          <Image src={site.assets.about.company} alt="AxolotlCode" width={516} height={516} />
        </div>
        <div className="company-cards flex w-full flex-col gap-[50px]">
          <div className="mb-8 text-center" data-animate="fadeInFromTop">
            <span className="type-kicker">Nuestros pilares</span>
            <h2 className="type-section-title mt-4">
              Conoce nuestra <span className="text-secondary-500">misión y visión</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {items.map((item, index) => (
              <article
                key={item.title}
                className="flex flex-col gap-4 px-6 py-4 text-center text-body-color shadow-[0_4px_10px_0_rgba(148,148,148,0.13)] backdrop-blur-[20px] md:text-left"
                data-animate="fadeInFromRight"
                data-delay={String(index * 0.12)}
              >
                <h3 className="text-2xl font-bold leading-7 xl:text-[32px] xl:leading-10">{item.title}</h3>
                <span className="text-sm leading-6 xl:text-base xl:leading-7">{item.body}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
