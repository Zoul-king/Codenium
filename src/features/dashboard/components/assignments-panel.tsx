import { mockProjects, mockUsers } from "@/lib/mocks";

export function AssignmentsPanel() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockProjects.map((project) => {
        const pm = mockUsers.find((user) => user.id === project.pmId);

        return (
          <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
            <p className="type-body mt-2">Cliente: {project.clientName}</p>
            <p className="mt-4 text-sm font-semibold text-primary-500">Responsable actual</p>
            <p className="mt-1 text-body-color">{pm?.name}</p>
          </article>
        );
      })}
    </div>
  );
}
