import { getSummaryCards } from "@/features/dashboard/lib/content";
import type { Role } from "@/lib/types/domain";

interface SummaryPanelsProps {
  role: Role;
}

export function SummaryPanels({ role }: SummaryPanelsProps) {
  const cards = getSummaryCards(role);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {cards.map((card) => (
        <article key={card.title} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <span className="type-kicker">{card.kicker}</span>
          <h2 className="mt-4 text-2xl font-bold text-body-color">{card.title}</h2>
          <div className="mt-4 space-y-3">
            {card.items.map((item) => (
              <div key={item} className="rounded-[18px] bg-foreground p-4">
                <p className="text-sm leading-6 text-body-color">{item}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
