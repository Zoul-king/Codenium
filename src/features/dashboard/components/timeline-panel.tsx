import { mockProjects } from "@/lib/mocks";

export function TimelinePanel() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockProjects.map((project) => (
        <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
            <span className="tag">{project.progress}%</span>
          </div>
          <p className="type-body mt-3">{project.summary}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-foreground">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${project.progress}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}
