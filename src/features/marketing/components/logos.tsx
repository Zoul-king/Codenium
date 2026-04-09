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
          <span className="type-kicker">Clientes satisfechos</span>
          <h2 className="type-section-title">
            Referencias que inspiran <span className="text-secondary-500">confianza</span>
          </h2>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">Trabajamos con el nivel de claridad visual y producto que hoy exigen marcas digitales fuertes.</p>
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
