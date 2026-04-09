import Link from "next/link";

interface CtaProps {
  dual?: boolean;
}

export function Cta({ dual = false }: CtaProps) {
  return (
    <section className="soft-section relative bg-primary-50">
      <div className="section site-shell relative z-20 flex flex-col items-center justify-center gap-6 py-14 lg:py-[105px]">
        <article className="flex w-full flex-col gap-6 rounded-[29px] border border-white bg-gradient-to-br from-transparent from-20% to-white/70 px-6 py-12 text-center sm:px-10 md:py-14" data-animate="fadeIn">
          <span className="type-section-title xl:text-[34px] xl:leading-[40px]">
            ¿Estás listo para llevar tus ideas al siguiente nivel?
          </span>
          <p className="type-body" data-animate="fadeInFromBottomSm" style={{ animationDelay: "100ms" }}>
            Hablemos y descubre cómo podemos ayudarte. O explora nuestras opciones y encuentra la solución perfecta para tu negocio.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-x-6 gap-y-2.5 text-sm xs:flex-row xl:text-base" data-animate="fadeInFromBottomSm" style={{ animationDelay: "180ms" }}>
            <Link className="primary-button max-w-[150px]" href="/contact">
              Contáctanos
            </Link>
            {dual ? (
              <Link
                href="/plans"
                className="rounded-[5px] border-2 border-primary-500 px-5 py-2 font-semibold text-primary-500 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-primary-600 hover:text-white"
              >
                Nuestros planes
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
