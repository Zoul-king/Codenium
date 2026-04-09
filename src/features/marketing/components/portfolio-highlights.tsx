const items = [
  {
    title: "Menos ruido",
    body: "Interfaces donde el producto se entiende rapido y la navegacion no estorba."
  },
  {
    title: "Mas lectura operativa",
    body: "Dashboards y vistas pensadas para priorizar informacion util, no adornos."
  },
  {
    title: "Base escalable",
    body: "Arquitectura visual y funcional lista para crecer sin perder claridad."
  }
];

export function PortfolioHighlights() {
  return (
    <section className="section bg-foreground">
      <div className="site-shell grid gap-5 py-12 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.title} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]" data-animate="fadeInFromBottom" data-delay={String(index * 0.06)}>
            <p className="text-lg font-semibold text-slate-900">{item.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
