"use client";

import { useState } from "react";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { getProjectStatusLabel } from "@/lib/presenters";
import type { ProjectStatus } from "@/lib/types/domain";

const options: ProjectStatus[] = ["discovery", "design", "build", "qa", "done"];

export function PmStatusPanel() {
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(getVisibleProjects("pm").map((project) => [project.id, project.status])) as Record<string, ProjectStatus>
  );

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <DashboardMutedCard>
        <SectionHeading eyebrow="Estado" title="Actualiza proyectos sin duplicar paneles" description="Cada fila deja claro que se cambia, para quien y en que etapa queda el proyecto." />
      </DashboardMutedCard>

      <DashboardCard>
        <div className="flex h-full flex-col">
          <SectionHeading eyebrow="Cambios activos" title="Estado por proyecto" />
          <div className="mt-6 flex-1 space-y-4">
            {getVisibleProjects("pm").map((project) => (
              <div key={project.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{project.clientName}</p>
                  </div>
                  <StatusBadge tone="accent">{getProjectStatusLabel(statuses[project.id])}</StatusBadge>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Nuevo estado
                    <select
                      value={statuses[project.id]}
                      onChange={(event) => setStatuses((current) => ({ ...current, [project.id]: event.target.value as ProjectStatus }))}
                      className="dashboard-select"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {getProjectStatusLabel(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="dashboard-button-primary">
                    Guardar cambio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
