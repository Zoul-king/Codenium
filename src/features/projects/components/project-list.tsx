import { mockProjects } from "@/lib/mocks";
import { formatLongDate, getProjectStatusLabel } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

interface ProjectListProps {
  role: Role;
}

export function ProjectList({ role }: ProjectListProps) {
  const items = role === "client" ? mockProjects.slice(0, 2) : mockProjects;

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((project) => (
        <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
              <p className="type-body mt-2">{project.summary}</p>
            </div>
            <span className="tag">{getProjectStatusLabel(project.status)}</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <span className="text-sm font-semibold text-primary-500">Cliente</span>
              <p className="mt-1 text-body-color">{project.clientName}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-500">Entrega estimada</span>
              <p className="mt-1 text-body-color">{formatLongDate(project.dueDate)}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-500">Avance</span>
              <p className="mt-1 text-body-color">{project.progress}%</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-500">Origen</span>
              <p className="mt-1 text-body-color">{project.quoteCode}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
