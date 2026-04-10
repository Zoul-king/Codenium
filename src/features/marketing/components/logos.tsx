import type { ClientLogo } from "@/features/marketing/types";

interface LogosProps {
  items: ClientLogo[];
}

export function Logos({ items }: LogosProps) {
  const repeated = [...items, ...items];

  return (
    <section className="section relative bg-foreground">
      <div className="site-shell flex min-h-[52vh] flex-col items-center justify-between gap-10 py-16 md:flex-row">
        <article className="flex w-full flex-col gap-4" data-animate="fadeInFromTop">
          <span className="type-kicker">Nuestros clientes</span>
          <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]">
            Empresas que <span className="text-primary-500">confiaron</span> en nuestro trabajo
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Hemos acompañado a diversas organizaciones en la construcción de su ecosistema digital,
            entregando soluciones que no solo cumplen con sus objetivos técnicos, sino que también
            fortalecen la confianza de sus usuarios finales a través de productos robustos y escalables.
          </p>
        </article>

        <article className="slider" data-animate="fadeInFromBottom">
          <div className="track">
            {repeated.map((item, index) => (
              <div key={`${item.alt}-${index}`} className="item">
                <div className="flex h-full w-full items-center justify-center rounded-[22px] border border-slate-200 bg-white px-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                  <span className="text-xl font-semibold tracking-[-0.04em] text-slate-800">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
