import { ServiceIcon } from "@/components/ui/icons";
import type { ServiceItem } from "@/features/marketing/types";

interface ServicesProps {
  items: ServiceItem[];
  compact?: boolean;
}

export function Services({ items, compact = false }: ServicesProps) {
  if (compact) {
    return (
      <section className="soft-section bg-foreground">
        <div className="services section site-shell py-20 text-center">
          <div className="info" data-animate="fadeInFromTop">
            <span className="type-kicker">Nuestros servicios</span>
            <h2 className="type-section-title mb-8 mt-4">
              ¿Cómo podemos <span className="text-secondary-500">ayudarte</span>?
            </h2>
          </div>
          <div className="items grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service, index) => (
              <article key={service.title} className="relative w-full rounded-lg bg-white p-8 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
                <div className="relative z-10 flex items-start gap-6">
                  <ServiceIcon type={service.icon} />
                  <div>
                    <h3 className="text-xl font-bold leading-6 xl:text-2xl xl:leading-7">{service.title}</h3>
                    <p className="mt-6 text-sm leading-[26px] xl:text-base xl:leading-7">{service.body}</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_45%_90%,rgba(86,202,204,0.35),transparent_35%)]" />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section soft-section">
      <div className="site-shell py-20">
        <div className="offer-info mb-20 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Novedades</span>
          <h2 className="type-section-title">¿Qué ofrecemos?</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <article key={service.title} className="service-card" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <ServiceIcon type={service.icon} />
              <h3 className="type-card-title">{service.title}</h3>
              <p className="text-center text-sm leading-6 text-gray-600 lg:text-base">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
