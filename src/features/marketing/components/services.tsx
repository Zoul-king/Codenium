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
        <div className="services section site-shell py-16 text-center">
          <div className="info" data-animate="fadeInFromTop">
            <span className="type-kicker">Nuestros servicios</span>
            <h2 className="type-section-title mb-8 mt-4">
              Como podemos <span className="text-secondary-500">ayudarte</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service, index) => (
              <article key={service.title} className="relative rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]" data-animate="fadeInFromBottom" data-delay={String(index * 0.06)}>
                <div className="relative z-10 flex items-start gap-4">
                  <ServiceIcon type={service.icon} />
                  <div>
                    <h3 className="text-lg font-semibold leading-6 xl:text-xl">{service.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{service.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section soft-section">
      <div className="site-shell py-16">
        <div className="offer-info mb-14 text-center" data-animate="fadeInFromTop">
          <span className="type-kicker">Novedades</span>
          <h2 className="type-section-title mt-4">Que ofrecemos?</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <article key={service.title} className="service-card min-h-[230px] rounded-[24px] p-6" data-animate="fadeInFromBottom" data-delay={String(index * 0.06)}>
              <ServiceIcon type={service.icon} />
              <h3 className="text-xl font-semibold leading-6 text-body-color">{service.title}</h3>
              <p className="text-center text-sm leading-6 text-slate-600">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
