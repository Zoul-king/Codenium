import type { AboutBlock } from "@/features/marketing/types";

interface StoryProps {
  paragraphs: string[];
  missionVision: AboutBlock[];
}

export function Story({ paragraphs, missionVision }: StoryProps) {
  return (
    <section className="section soft-section bg-surface-soft">
      <div className="site-shell py-14">
        <div className="grid gap-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)] lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <article className="flex flex-col gap-4 text-sm leading-7 text-slate-600 lg:text-base" data-animate="fadeInFromLeft">
            <span className="font-semibold uppercase tracking-[0.18em] text-purple-600">Sobre nosotros</span>
            <h2 className="text-[28px] font-bold leading-8 tracking-[-0.03em] text-slate-950 lg:text-[40px] lg:leading-[48px]">
              Conoce nuestra <span className="text-primary-500">historia</span>
            </h2>

            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <div className="grid gap-4" data-animate="fadeInFromRight">
            {missionVision.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
