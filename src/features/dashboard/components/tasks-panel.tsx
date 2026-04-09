import { getVisibleProjects } from "@/features/dashboard/lib/selectors";

const priorityByProgress = (progress: number) => {
  if (progress >= 80) {
    return "Cierre";
  }

  if (progress >= 45) {
    return "Media";
  }

  return "Alta";
};

export function TasksPanel() {
  const items = getVisibleProjects("pm").map((project) => ({
    title: project.progress >= 80 ? "Validar entregables finales con el cliente" : project.progress >= 45 ? "Alinear próximos entregables del sprint" : "Confirmar alcance y accesos pendientes",
    helper: project.name,
    priority: priorityByProgress(project.progress)
  }));

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((task) => (
        <article key={`${task.helper}-${task.title}`} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
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
