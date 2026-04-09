import { DashboardCard, DashboardMutedCard, MetricPill, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getPrimaryUser, getUserById } from "@/features/dashboard/lib/selectors";
import type { Role } from "@/lib/types/domain";

interface ProfilePanelProps {
  role: Role;
}

export function ProfilePanel({ role }: ProfilePanelProps) {
  const user = getPrimaryUser(role);
  const project = getPrimaryProject(role);
  const pm = getUserById(project?.pmId);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.88fr_1.12fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Perfil" title={user?.name ?? "Sin usuario"} description={user?.title} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricPill label="Correo" value={user?.email ?? "-"} tone="accent" />
          <MetricPill label="Telefono" value={user?.phone ?? "-"} />
          <MetricPill label="Empresa" value={user?.company ?? "Pendiente"} />
          <MetricPill label="Proyectos activos" value={String(user?.activeProjects ?? 0)} />
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Contacto operativo" title="Tu punto de seguimiento" />
        <div className="mt-6 grid gap-4">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">PM asignado</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{pm?.name ?? "Pendiente"}</p>
            <p className="mt-2 text-sm text-slate-600">{pm?.email ?? "Se mostrara al confirmar el proyecto."}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Proyecto visible</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{project?.name ?? "Sin proyecto"}</p>
            <p className="mt-2 text-sm text-slate-600">{project?.summary ?? "La vista se simplifica cuando aun no hay ejecucion activa."}</p>
          </div>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
