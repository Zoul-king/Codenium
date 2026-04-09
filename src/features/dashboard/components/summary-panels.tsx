import { mockProjects } from "@/lib/mocks";

export function SummaryPanels() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
        <span className="type-kicker">Vista principal</span>
        <h2 className="mt-4 text-2xl font-bold text-body-color">Estado general</h2>
        <p className="type-body mt-4">
          Esta vista consolida la navegación mock del rol y queda preparada para conectarse a fuentes reales sin cambiar la UI.
        </p>
      </article>
      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
        <span className="type-kicker">Actividad reciente</span>
        <div className="mt-4 space-y-3">
          {mockProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="rounded-[18px] bg-foreground p-4">
              <strong className="block text-body-color">{project.name}</strong>
              <p className="mt-2 text-sm text-gray-600">{project.summary}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
