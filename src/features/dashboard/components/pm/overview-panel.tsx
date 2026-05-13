"use client";

import { AlertTriangle, ArrowLeftRight, Calendar, CheckCircle2, Circle, Clock, Loader2, MoveRight } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getProjectMilestones,
  getSelectedProject,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { MilestonePhase, ProjectStatus } from "@/lib/types/domain";
import { formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

// Colores fuertes (no pastel). Desarrollo en café rojizo intenso y Entregado
// en verde sólido, según preferencia del usuario.
const KANBAN_COLUMNS: { status: ProjectStatus; label: string; tone: string; chip: string }[] = [
  {
    status: "discovery",
    label: "Definición",
    tone: "border-sky-600 bg-sky-600/15",
    chip: "bg-sky-600 text-white"
  },
  {
    status: "design",
    label: "Diseño",
    tone: "border-amber-600 bg-amber-500/15",
    chip: "bg-amber-600 text-white"
  },
  {
    status: "build",
    label: "Desarrollo",
    // Café rojizo más rojo que café.
    tone: "border-[#a4322d] bg-[#a4322d]/15",
    chip: "bg-[#a4322d] text-white"
  },
  {
    status: "qa",
    label: "QA",
    tone: "border-violet-600 bg-violet-600/15",
    chip: "bg-violet-600 text-white"
  },
  {
    status: "done",
    label: "Entregado",
    tone: "border-emerald-600 bg-emerald-600/15",
    chip: "bg-emerald-600 text-white"
  }
];

// Fase oculta del kanban: no aparece como columna, pero el PM puede mover hitos
// aquí desde el menú "Mover a" y se listan en la pestaña Bloqueados.
const BLOCKED_PHASE: { status: MilestonePhase; label: string; chip: string } = {
  status: "blocked",
  label: "Bloqueados",
  chip: "bg-slate-400 text-white"
};

export function PmOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const allProjects = getVisibleProjects(state, "pm");
  const selectedProject = getSelectedProject(state, "pm");

  // Selección global cliente → proyecto. El cliente activo se deriva del
  // proyecto seleccionado para mantener una sola fuente de verdad.
  const clientsForPm = useMemo(() => {
    const byId = new Map<string, { id: string; name: string }>();
    for (const p of allProjects) {
      if (!byId.has(p.clientId)) byId.set(p.clientId, { id: p.clientId, name: p.clientName });
    }
    return Array.from(byId.values());
  }, [allProjects]);

  const selectedClientId = selectedProject?.clientId ?? "";
  const projectsForClient = useMemo(
    () => allProjects.filter((p) => !selectedClientId || p.clientId === selectedClientId),
    [allProjects, selectedClientId]
  );

  function handleClientChange(clientId: string) {
    const firstForClient = allProjects.find((p) => p.clientId === clientId);
    selectProject("pm", firstForClient?.id ?? "");
  }

  function handleProjectChange(projectId: string) {
    selectProject("pm", projectId);
  }

  const activeProjects = allProjects.filter((p) => p.status !== "done");

  const totalMilestones = allProjects.reduce(
    (acc, p) => acc + getProjectMilestones(state, p.id).length,
    0
  );
  const blockedMilestonesCount = allProjects.reduce(
    (acc, p) => acc + getProjectMilestones(state, p.id).filter((m) => m.phase === "blocked").length,
    0
  );
  const overdueMilestones = allProjects.reduce((acc, p) => {
    const ms = getProjectMilestones(state, p.id);
    const today = new Date();
    return acc + ms.filter((m) => m.status !== "done" && new Date(`${m.date}T12:00:00`) < today).length;
  }, 0);

  // Hitos del proyecto seleccionado (con su fase resuelta). Sirve tanto al
  // kanban como a la pestaña Bloqueados para que ambas vistas operen sobre
  // el mismo proyecto.
  const milestonesForSelectedProject = useMemo(() => {
    if (!selectedProject) return [];
    return getProjectMilestones(state, selectedProject.id).map((m) => ({
      milestoneId: m.id,
      milestoneTitle: m.title,
      milestoneDate: m.date,
      projectName: selectedProject.name,
      projectId: selectedProject.id,
      phase: (m.phase ?? selectedProject.status) as MilestonePhase
    }));
  }, [selectedProject, state]);

  const blockedMilestonesForSelected = milestonesForSelectedProject.filter((m) => m.phase === "blocked");

  return (
    <div className="space-y-6">
      {/* HEADER STATS */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <OpsStatCard
          label="Proyectos activos"
          value={activeProjects.length}
          icon={<Loader2 className="size-4" />}
        />
        <OpsStatCard
          label="Bloqueados"
          value={blockedMilestonesCount}
          icon={<AlertTriangle className="size-4" />}
          tone={blockedMilestonesCount > 0 ? "warning" : "neutral"}
        />
        <OpsStatCard
          label="Hitos totales"
          value={totalMilestones}
          icon={<CheckCircle2 className="size-4" />}
        />
        <OpsStatCard
          label="Hitos atrasados"
          value={overdueMilestones}
          icon={<Clock className="size-4" />}
          tone={overdueMilestones > 0 ? "error" : "neutral"}
        />
      </div>

      <Tabs defaultValue="kanban">
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          {/* Espaciador / selector cliente (a la izquierda en desktop) */}
          <div className="flex items-center gap-2 justify-self-start sm:justify-self-stretch">
            <Label className="hidden whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-slate-500 sm:inline">
              Cliente
            </Label>
            <Select value={selectedClientId} onValueChange={handleClientChange}>
              <SelectTrigger className="h-9 w-full max-w-[220px] text-xs">
                <SelectValue placeholder="Selecciona cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientsForPm.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Sin clientes.</div>
                ) : (
                  clientsForPm.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs centradas */}
          <TabsList variant="line" className="justify-self-center bg-transparent">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="blocked">Bloqueados</TabsTrigger>
          </TabsList>

          {/* Selector proyecto (a la derecha en desktop) */}
          <div className="flex items-center justify-end gap-2 justify-self-end sm:justify-self-stretch">
            <Label className="hidden whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-slate-500 sm:inline">
              Proyecto
            </Label>
            <Select
              value={selectedProject?.id ?? ""}
              onValueChange={handleProjectChange}
              disabled={!selectedClientId}
            >
              <SelectTrigger className="h-9 w-full max-w-[260px] text-xs">
                <SelectValue placeholder={selectedClientId ? "Selecciona proyecto" : "Elige cliente"} />
              </SelectTrigger>
              <SelectContent>
                {projectsForClient.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Sin proyectos.</div>
                ) : (
                  projectsForClient.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KANBAN VIEW — hitos del proyecto seleccionado agrupados por fase. La
            fase se persiste por hito (Milestone.description prefijado con
            [p:<fase>]) y el PM la cambia desde el menú "Mover a" en cada card.
            Los hitos en fase "blocked" no aparecen aquí — viven en la pestaña
            Bloqueados. */}
        <TabsContent value="kanban" className="mt-6">
          {allProjects.length === 0 ? (
            <DashboardEmptyState
              title="No tienes proyectos asignados"
              body="Cuando admin te asigne uno, aparecerá aquí en su columna correspondiente."
            />
          ) : !selectedProject ? (
            <DashboardEmptyState
              title="Selecciona un proyecto"
              body="Elige un cliente y un proyecto arriba para ver su tablero."
            />
          ) : (
            <KanbanBoard
              items={milestonesForSelectedProject.filter((m) => m.phase !== "blocked")}
            />
          )}
        </TabsContent>

        {/* BLOCKED VIEW — hitos del proyecto seleccionado que el PM movió a la
            fase "blocked". Cada card mantiene el mismo dropdown para regresar
            a una columna del kanban. */}
        <TabsContent value="blocked" className="mt-6">
          {!selectedProject ? (
            <DashboardEmptyState
              title="Selecciona un proyecto"
              body="Elige un cliente y un proyecto arriba para ver sus hitos bloqueados."
            />
          ) : blockedMilestonesForSelected.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {blockedMilestonesForSelected.map((m) => (
                <MilestoneKanbanCard key={m.milestoneId} item={m} />
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="Sin hitos bloqueados"
              body="Cuando muevas un hito a Bloqueados aparecerá aquí."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

type KanbanItem = {
  milestoneId: string;
  milestoneTitle: string;
  milestoneDate: string;
  projectName: string;
  projectId: string;
  phase: MilestonePhase;
};

function KanbanBoard({ items }: { items: KanbanItem[] }) {
  const grouped = useMemo(() => {
    const groups: Record<ProjectStatus, KanbanItem[]> = {
      discovery: [],
      design: [],
      build: [],
      qa: [],
      done: []
    };
    for (const item of items) {
      if (item.phase === "blocked") continue;
      groups[item.phase as ProjectStatus]?.push(item);
    }
    return groups;
  }, [items]);

  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {KANBAN_COLUMNS.map((col) => {
        const colItems = grouped[col.status] ?? [];
        return (
          <div key={col.status} className={cn("rounded-[var(--radius-card-dense)] border-2 p-3", col.tone)}>
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900">
                {col.label}
              </span>
              <Badge variant="secondary" className={cn("h-5 min-w-5 justify-center text-[10px]", col.chip)}>
                {colItems.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {colItems.map((m) => (
                <MilestoneKanbanCard key={m.milestoneId} item={m} />
              ))}
              {colItems.length === 0 ? (
                <div className="rounded-[12px] border border-dashed border-slate-300 bg-white/60 px-3 py-6 text-center">
                  <span className="text-[11px] text-slate-500">Vacío</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MilestoneKanbanCard({ item }: { item: KanbanItem }) {
  const { setMilestonePhase } = useDashboardWorkspace();

  async function handleMove(nextPhase: MilestonePhase) {
    try {
      await setMilestonePhase(item.milestoneId, nextPhase);
      toast.success("Hito movido");
    } catch (error) {
      toast.error("No se pudo mover el hito", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  // Opciones del dropdown: las 5 fases visibles del kanban + la fase oculta
  // "Bloqueados". El hito en su fase actual queda filtrado para evitar mover
  // un hito a donde ya está.
  const phaseOptions: { status: MilestonePhase; label: string; chip: string }[] = [
    ...KANBAN_COLUMNS.map((c) => ({ status: c.status, label: c.label, chip: c.chip })),
    BLOCKED_PHASE
  ];

  return (
    <article className="ops-card relative block w-full text-left">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-tight text-slate-950">
            {item.milestoneTitle}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{item.projectName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Mover hito">
              {item.phase === "blocked" ? (
                <ArrowLeftRight className="size-3.5" />
              ) : (
                <MoveRight className="size-3.5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              {item.phase === "blocked" ? "Regresar al kanban" : "Mover a"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {phaseOptions
              .filter((opt) => opt.status !== item.phase)
              .map((opt) => (
                <DropdownMenuItem
                  key={opt.status}
                  onClick={() => handleMove(opt.status)}
                >
                  <span className={cn("size-2 rounded-full", opt.chip)} />
                  {opt.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
        <Calendar className="size-3" />
        Entrega aprox.: {formatShortDate(item.milestoneDate)}
      </div>
    </article>
  );
}

function OpsStatCard({
  label,
  value,
  icon,
  tone = "neutral"
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "neutral" | "warning" | "error";
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="kpi-label">{label}</span>
        <span
          className={cn(
            "grid size-7 place-items-center rounded-full",
            tone === "warning"
              ? "bg-warning-50 text-warning-700"
              : tone === "error"
                ? "bg-error-50 text-error-700"
                : "bg-slate-100 text-slate-600"
          )}
        >
          {icon}
        </span>
      </div>
      <p className="kpi-value mt-3">{value}</p>
    </div>
  );
}

void Circle;
