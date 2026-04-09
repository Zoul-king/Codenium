const mockTasks = [
  "Definir alcance final de checkout para Nutrition Lab.",
  "Alinear prioridades del sprint con equipo frontend.",
  "Confirmar accesos de staging con cliente Sittycia."
];

export function TasksPanel() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockTasks.map((task) => (
        <article key={task} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <h3 className="text-lg font-bold text-body-color">{task}</h3>
        </article>
      ))}
    </div>
  );
}
