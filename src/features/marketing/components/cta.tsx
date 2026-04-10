import Link from "next/link";

interface CtaProps {
  dual?: boolean;
}

export function Cta({ dual = false }: CtaProps) {
  return (
    <section className="soft-section relative bg-primary-50">
      <div className="section site-shell relative z-20 flex flex-col items-center justify-center gap-6 py-14 lg:py-[105px]">
        <article className="flex w-full flex-col gap-6 rounded-[29px] border border-white bg-gradient-to-br from-transparent from-20% to-white/70 px-6 py-12 text-center sm:px-10 md:py-14" data-animate="fadeIn">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-slate-950 lg:text-[40px]">
            ¿Listo para convertir una idea en un proyecto claro?
          </h2>
          <p className="type-body mx-auto max-w-2xl" data-animate="fadeInFromBottomSm" style={{ animationDelay: "100ms" }}>
            Conversemos, revisemos el alcance y encontremos la mejor forma de construirlo contigo.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row" data-animate="fadeInFromBottomSm" style={{ animationDelay: "180ms" }}>
            <Link className="primary-button" href="/contact">
              Contáctanos
            </Link>
            {dual ? (
              <Link href="/plans" className="secondary-button">
                Ver planes
              </Link>
            ) : null}
          </div>

        </article>
      </div>
    </section>
  );
}
