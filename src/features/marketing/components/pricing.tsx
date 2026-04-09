import Link from "next/link";

import type { PlanItem } from "@/features/marketing/types";

interface PricingProps {
  plans: PlanItem[];
}

export function Pricing({ plans }: PricingProps) {
  return (
    <section className="soft-section relative">
      <div className="section site-shell relative z-20 py-20 text-black">
        <div className="plan-info mb-12 text-center lg:text-left" data-animate="fadeInFromTop">
          <span className="type-kicker">Nuestros planes</span>
          <h2 className="type-section-title mt-4">
            ¿Qué <span className="text-secondary-500">ofrecemos</span>?
          </h2>
        </div>
        <div className="items grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <article key={plan.title} className="flex flex-col justify-between rounded-lg bg-white px-12 py-8 shadow-lg" data-animate="fadeInFromBottom" data-delay={String(index * 0.08)}>
              <div className="w-full">
                <div className="mb-10">
                  <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">{plan.title}</h3>
                  <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                  <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">{plan.price}</span>
                  {plan.subtitle ? <p className="text-base leading-5 lg:text-2xl lg:leading-7">{plan.subtitle}</p> : null}
                </div>
                {plan.note ? <span className="text-sm font-medium leading-6 text-primary-500 lg:text-base lg:leading-7">{plan.note}</span> : null}
                <ul className="mb-20 list-disc">
                  {plan.items.map((item) => (
                    <li key={item} className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="secondary-button !justify-center">
                Contáctanos
              </Link>
            </article>
          ))}
          <article className="flex flex-col justify-between rounded-lg bg-white px-12 py-8 shadow-lg xl:col-span-3" data-animate="fadeInFromBottom" data-delay="0.24">
            <div className="w-full">
              <div className="mb-10">
                <h3 className="text-xl leading-6 lg:text-[28px] lg:leading-8">Plan personalizado</h3>
                <div className="my-2.5 h-[1px] w-[110px] bg-black" />
                <span className="mb-2.5 block text-[28px] font-bold leading-[34px] lg:text-[40px] lg:leading-[48px]">
                  Contáctanos para discutir un presupuesto.
                </span>
              </div>
              <ul className="mb-20 list-disc">
                <li className="ml-5 text-sm leading-6 lg:text-base lg:leading-7">Consultoría personalizada</li>
              </ul>
            </div>
            <Link href="/contact" className="secondary-button !justify-center">
              Contáctanos
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
