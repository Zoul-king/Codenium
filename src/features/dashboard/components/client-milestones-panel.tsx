import { DashboardCard, DashboardMutedCard, ProgressBar, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getProjectMilestones, getUpcomingMilestones } from "@/features/dashboard/lib/selectors";
import { formatLongDate } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

interface ClientMilestonesPanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ClientMilestonesPanel({ role }: ClientMilestonesPanelProps) {
  const primaryProject = getPrimaryProject("client");
  const items =
    role === "client"
      ? getProjectMilestones(primaryProject?.id).map((milestone) => ({ ...milestone, projectName: primaryProject?.name ?? "" }))
      : getUpcomingMilestones("pm");

  const currentCount = items.filter((item) => item.status === "current").length;

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.78fr_1.22fr]">
      <DashboardCard>
        <SectionHeading
          eyebrow={role === "client" ? "Timeline del proyecto" : "Timeline de entregas"}
          title={role === "client" ? "Hitos visibles y proximos pasos" : "Secuencia real por proyecto"}
          description={role === "client" ? "Cada punto marca una decision o entrega concreta. No usamos tarjetas sueltas sin contexto." : "Las fechas salen de proyectos asignados y ayudan a priorizar revisiones y entregas."}
        />
        <div className="mt-6 grid gap-4">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Hitos activos</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{currentCount}</p>
            <div className="mt-4">
              <ProgressBar value={items.length === 0 ? 0 : Math.round((items.filter((item) => item.status === "done").length / items.length) * 100)} />
            </div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <p className="text-sm leading-6 text-slate-600">El timeline resume aprobaciones, desarrollo en curso y siguientes revisiones dentro del mismo flujo operativo.</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <div className="flex h-full flex-col">
          <SectionHeading eyebrow="Ruta" title="Linea de trabajo" />
          <div className="mt-6 flex-1 space-y-4">
            {items.map((milestone, index) => (
              <div key={milestone.id} className="grid grid-cols-[24px_minmax(0,1fr)] gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${
                      milestone.status === "done" ? "bg-emerald-500" : milestone.status === "current" ? "bg-primary-500" : "bg-amber-500"
                    }`}
                  />
                  {index < items.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{milestone.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{role === "pm" ? milestone.projectName : "Proyecto activo"}</p>
                    </div>
                    <StatusBadge tone={milestone.status === "done" ? "success" : milestone.status === "current" ? "accent" : "warning"}>
                      {milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Siguiente"}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{milestone.summary}</p>
                  <p className="mt-3 text-sm font-medium text-slate-500">{formatLongDate(milestone.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardMutedCard>
    </div>
  );
}
