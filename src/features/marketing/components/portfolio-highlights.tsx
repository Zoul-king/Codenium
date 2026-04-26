const items = [
  {
    title: "Menos ruido",
    body: "Interfaces donde el producto se entiende rapido y la navegacion no estorba."
  }
];

export function PortfolioHighlights() {
  return (
    <section className="section bg-surface-soft">
      <div className="site-shell py-12">
        {items.map((item, index) => (
          <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)] lg:px-8" data-animate="fadeInFromBottom" data-delay={String(index * 0.06)}>
            <div className="grid gap-4 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
              <p className="text-[24px] font-semibold tracking-[-0.04em] text-slate-900 lg:text-[30px]">{item.title}</p>
              <p className="text-sm leading-7 text-slate-600 lg:text-base">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
