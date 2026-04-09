import { mockProjects, mockUsers } from "@/lib/mocks";
import { formatShortDate } from "@/lib/presenters";

export function AssignmentsPanel() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockProjects.map((project) => {
        const pm = mockUsers.find((user) => user.id === project.pmId);

        return (
          <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
                <p className="type-body mt-2">Cliente: {project.clientName}</p>
              </div>
              <span className="tag">Entrega {formatShortDate(project.dueDate)}</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-primary-500">Responsable actual</p>
                <p className="mt-1 text-body-color">{pm?.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-500">Carga del PM</p>
                <p className="mt-1 text-body-color">{pm?.activeProjects} proyectos activos</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
