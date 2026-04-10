import type { ClientLogo } from "@/features/marketing/types";

interface LogosProps {
  items: ClientLogo[];
}

export function Logos({ items }: LogosProps) {
  const repeated = [...items, ...items];

  return (
    <section className="section relative bg-foreground">
      <div className="site-shell flex min-h-[52vh] flex-col gap-10 py-16">
        <article className="flex w-full flex-col gap-4 text-center md:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker-accent">Nuestros clientes</span>
          <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]">
            Empresas que <span className="text-primary-500">inspiran</span> productos digitales de alto nivel
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 md:mx-0 md:text-base">
            Referencias visuales del ecosistema tecnologico que inspiran estandares de producto, ejecucion y detalle.
          </p>
        </article>

        <article className="logo-marquee-shell" data-animate="fadeInFromBottom" aria-label="Empresas tecnologicas de referencia">
          <div className="logo-marquee-track">
            {repeated.map((item, index) => (
              <a
                key={`${item.alt}-${index}`}
                href={item.href ?? "#"}
                target={item.href ? "_blank" : undefined}
                rel={item.href ? "noreferrer" : undefined}
                className="logo-marquee-card"
                aria-label={item.alt}
              >
                {item.src ? (
                  <img src={item.src} alt={item.alt} className="logo-marquee-image" loading="lazy" />
                ) : (
                  <span className="text-xl font-semibold tracking-[-0.04em] text-slate-800">{item.alt}</span>
                )}
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
