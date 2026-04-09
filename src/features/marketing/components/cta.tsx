import Link from "next/link";

interface CtaProps {
  dual?: boolean;
}

export function Cta({ dual = false }: CtaProps) {
  return (
    <section className="soft-section relative bg-primary-50">
      <div className="section site-shell relative z-20 flex flex-col items-center justify-center gap-6 py-14 lg:py-[105px]">
        <article className="flex w-full flex-col gap-6 rounded-[29px] border border-white bg-gradient-to-br from-transparent from-20% to-white/70 px-6 py-12 text-center sm:px-10 md:py-14" data-animate="fadeIn">
          <span className="type-section-title xl:text-[34px] xl:leading-[40px]">Listo para convertir una idea en un proyecto claro?</span>
          <p className="type-body" data-animate="fadeInFromBottomSm" style={{ animationDelay: "100ms" }}>
            Conversemos, revisemos el alcance y encontremos la mejor forma de construirlo contigo.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-x-6 gap-y-2.5 text-sm xs:flex-row xl:text-base" data-animate="fadeInFromBottomSm" style={{ animationDelay: "180ms" }}>
            <Link className="primary-button max-w-[150px]" href="/contact">
              Contactanos
            </Link>
            {dual ? (
              <Link href="/plans" className="dashboard-button-secondary">
                Ver planes
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
