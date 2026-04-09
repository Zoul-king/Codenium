import Image from "next/image";

import type { ClientLogo } from "@/features/marketing/types";

interface LogosProps {
  items: ClientLogo[];
}

export function Logos({ items }: LogosProps) {
  const repeated = [...items, ...items];

  return (
    <section className="section relative bg-foreground">
      <div className="site-shell flex min-h-[70vh] flex-col items-center justify-between gap-x-7 gap-y-12 py-16 md:flex-row">
        <article className="flex w-full flex-col gap-4" data-animate="fadeInFromTop">
          <span className="type-kicker">Clientes satisfechos</span>
          <h2 className="type-section-title">
            Marcas que <span className="text-secondary-500">confiaron</span> en nuestro trabajo
          </h2>
          <p className="max-w-2xl text-sm text-body-color sm:text-base">
            Nos enorgullece haber desarrollado sitios web para empresas que valoran la calidad. Estas son algunas de las marcas que confiaron en nosotros.
          </p>
        </article>
        <article className="slider" data-animate="fadeInFromBottom">
          <div className="track">
            {repeated.map((item, index) => (
              <div key={`${item.alt}-${index}`} className="item cursor-pointer">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="flex h-full w-full items-center justify-center">
                    <Image src={item.src} alt={item.alt} width={220} height={120} className="logo-slide-image h-auto max-h-[120px] w-auto" />
                  </a>
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <Image src={item.src} alt={item.alt} width={220} height={120} className="logo-slide-image h-auto max-h-[120px] w-auto" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
