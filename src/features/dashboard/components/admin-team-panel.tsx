import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPmStats, getPmUsers, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";

export function AdminTeamPanel() {
  const pmUsers = getPmUsers();
  const projects = getVisibleProjects("admin");

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Capacidad" title="PMs y carga actual" description="Cada PM muestra activos y completados para decidir nuevas asignaciones." />
        <div className="mt-6 grid gap-4">
          {pmUsers.map((pm) => {
            const stats = getPmStats(pm.id);

            return (
              <div key={pm.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{pm.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{pm.email}</p>
                  </div>
                  <StatusBadge tone={stats.activeProjects >= 2 ? "warning" : "success"}>{stats.activeProjects >= 2 ? "Carga alta" : "Disponible"}</StatusBadge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Activos</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{stats.activeProjects}</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Completados</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{stats.completedProjects}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Mapa de proyectos" title="Asignaciones visibles" />
        <div className="mt-6 grid gap-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{project.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{project.clientName}</p>
                </div>
                <StatusBadge tone={project.status === "done" ? "success" : "accent"}>{getProjectStatusLabel(project.status)}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Entrega {formatShortDate(project.dueDate)} y origen {project.quoteCode}.</p>
            </div>
          ))}
        </div>
      </DashboardMutedCard>
    </div>
  );
}
