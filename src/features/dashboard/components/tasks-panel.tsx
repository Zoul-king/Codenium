const mockTasks = [
  {
    title: "Definir alcance final del checkout",
    helper: "Nutrition Lab Commerce",
    priority: "Alta"
  },
  {
    title: "Alinear prioridades del sprint con frontend",
    helper: "Corte semanal de planeación",
    priority: "Media"
  },
  {
    title: "Confirmar accesos de staging con cliente",
    helper: "Portal Valhui Pro",
    priority: "Alta"
  }
];

export function TasksPanel() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockTasks.map((task) => (
        <article key={task.title} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-body-color">{task.title}</h3>
              <p className="type-body mt-2">{task.helper}</p>
            </div>
            <span className="tag">{task.priority}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
