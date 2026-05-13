"use client";

import { CalendarDays, CheckCircle2, Circle, Clock, Pencil, Plus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextField, TextAreaField } from "@/components/common/form-field";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getProjectChangeRequests,
  getProjectMilestones,
  getSelectedOrPrimaryProject
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import type { ChangeRequestRecord, ChangeRequestType, MilestonePhase, ProjectMilestoneRecord, ProjectStatus } from "@/lib/types/domain";

// Paleta del kanban: mantenida sincronizada con pm/overview-panel para que el
// color del círculo del hito (y sus cambios) sea idéntico al de la columna en
// la que vive ese hito.
// Paleta sincronizada con KANBAN_COLUMNS de pm/overview-panel: el color base
// del kanban es <hue>-600 (#a4322d para build), así que el gradiente del
// círculo va de <hue>-500 a <hue>-700 para que el centro visual coincida
// exactamente con el color sólido de la columna. Connectors y badges usan
// directamente el color base.
const PHASE_THEME: Record<MilestonePhase, { node: string; connector: string; card: string; badge: string }> = {
  discovery: {
    node: "bg-gradient-to-b from-sky-500 to-sky-700",
    connector: "bg-sky-600",
    card: "border-sky-300 bg-sky-50/50",
    badge: "bg-sky-100 text-sky-700"
  },
  design: {
    node: "bg-gradient-to-b from-amber-500 to-amber-700",
    connector: "bg-amber-600",
    card: "border-amber-300 bg-amber-50/50",
    badge: "bg-amber-100 text-amber-800"
  },
  build: {
    node: "bg-gradient-to-b from-[#c4564f] to-[#7a241e]",
    connector: "bg-[#a4322d]",
    card: "border-[#a4322d]/40 bg-[#a4322d]/5",
    badge: "bg-[#a4322d]/15 text-[#a4322d]"
  },
  qa: {
    node: "bg-gradient-to-b from-violet-500 to-violet-700",
    connector: "bg-violet-600",
    card: "border-violet-300 bg-violet-50/50",
    badge: "bg-violet-100 text-violet-700"
  },
  done: {
    node: "bg-gradient-to-b from-emerald-500 to-emerald-700",
    connector: "bg-emerald-600",
    card: "border-emerald-300 bg-emerald-50/50",
    badge: "bg-emerald-100 text-emerald-700"
  },
  blocked: {
    node: "bg-gradient-to-b from-slate-400 to-slate-600",
    connector: "bg-slate-500",
    card: "border-slate-300 bg-slate-50/50",
    badge: "bg-slate-200 text-slate-700"
  }
};
import { formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

const CHANGE_TYPE_LABEL: Record<ChangeRequestType, string> = {
  visual: "Visual",
  funcional: "Funcional",
  contenido: "Contenido",
  tecnico: "Técnico",
  bugfix: "Corrección",
  otro: "Otro"
};

export function ClientMilestonesPanel() {
  const { state, refreshChangeRequests } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, "client");
  const milestones = (getProjectMilestones(state, project?.id) ?? [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const changes = getProjectChangeRequests(state, project?.id);

  // Mantiene los cambios sincronizados con la DB: el PM puede aceptar/rechazar
  // desde su panel y necesitamos reflejarlo aquí sin recargar la página.
  // Usamos un ref para que el interval no dependa de la identidad de
  // refreshChangeRequests (que cambia cada vez que el store recompone su value
  // memoizado por state), evitando un loop fetch → setState → re-render → fetch.
  const refreshRef = useRef(refreshChangeRequests);
  refreshRef.current = refreshChangeRequests;

  useEffect(() => {
    const run = () => refreshRef.current();
    run();
    const interval = window.setInterval(run, 15000);
    window.addEventListener("focus", run);
    document.addEventListener("visibilitychange", run);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", run);
      document.removeEventListener("visibilitychange", run);
    };
  }, []);

  if (!project) {
    return (
      <DashboardEmptyState
        title="Selecciona un proyecto"
        body="Para ver hitos y solicitar cambios, primero elige un proyecto en la sección Proyectos."
      />
    );
  }

  const done = milestones.filter((m) => m.status === "done");
  const current = milestones.filter((m) => m.status === "current");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-slate-200 bg-white px-5 py-3 shadow-[var(--shadow-card)]">
        <div className="flex items-baseline gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#224a78)]">
            Roadmap
          </p>
          <h1 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{project.name}</h1>
        </div>
        <NewChangeRequestDialog project={project} milestones={milestones} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MilestoneStatChip label="Total" value={milestones.length} />
        <MilestoneStatChip label="En curso" value={current.length} tone="info" />
        <MilestoneStatChip label="Completados" value={done.length} tone="success" />
      </div>

      <Tabs defaultValue="all">
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="current">En curso</TabsTrigger>
          <TabsTrigger value="done">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MilestoneAndChangesTimeline items={milestones} changes={changes} defaultPhase={project.status} />
        </TabsContent>
        <TabsContent value="current" className="mt-6">
          <MilestoneAndChangesTimeline items={current} changes={changes} defaultPhase={project.status} />
        </TabsContent>
        <TabsContent value="done" className="mt-6">
          <MilestoneAndChangesTimeline items={done} changes={changes} defaultPhase={project.status} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MilestoneAndChangesTimeline({
  items,
  changes,
  defaultPhase
}: {
  items: ProjectMilestoneRecord[];
  changes: ChangeRequestRecord[];
  defaultPhase: ProjectStatus;
}) {
  if (items.length === 0) {
    return (
      <DashboardEmptyState
        title="Sin hitos"
        body="No hay hitos en esta categoría todavía."
      />
    );
  }

  // El cliente ve todas sus solicitudes (incluso pendientes y rechazadas) para
  // tener trazabilidad. La tarjeta refleja el estado actual.
  const visibleChanges = changes;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] lg:gap-0">
      <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Hitos
      </div>
      <div className="hidden lg:block" />
      <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Cambios solicitados
      </div>

      {items.map((m) => {
        const milestoneChanges = visibleChanges.filter((c) => c.milestoneId === m.id);
        return (
          <MilestoneRow
            key={m.id}
            milestone={m}
            changes={milestoneChanges}
            defaultPhase={defaultPhase}
          />
        );
      })}
    </div>
  );
}

function MilestoneRow({
  milestone,
  changes,
  defaultPhase
}: {
  milestone: ProjectMilestoneRecord;
  changes: ChangeRequestRecord[];
  defaultPhase: ProjectStatus;
}) {
  // El color del círculo del hito (y de sus cambios) es el color de la columna
  // del kanban en la que está. Si el PM aún no le asignó fase, se usa la fase
  // del proyecto padre como default.
  const phase: MilestonePhase = milestone.phase ?? defaultPhase;
  const theme = PHASE_THEME[phase];
  const tone = {
    node: theme.node,
    card: theme.card,
    accent: theme.connector,
    badge: theme.badge,
    connector: theme.connector
  };

  const statusLabel =
    milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Pendiente";

  return (
    <>
      {/* Columna izquierda: hito */}
      <div className="relative pl-14">
        <span className="absolute left-[27px] inset-y-0 w-0.5 bg-slate-200" aria-hidden />

        {/* Wrapper interno: dimensiona al alto del card para que circulo y
            conector queden centrados con el card del hito, sin importar la
            altura de la columna derecha. */}
        <div className="relative">
          <span
            className={cn(
              "absolute left-[-48px] top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full z-10",
              tone.node
            )}
          >
            {milestone.status === "done" ? (
              <CheckCircle2 className="size-5 text-white" />
            ) : milestone.status === "current" ? (
              <Clock className="size-5 text-white" />
            ) : (
              <Circle className="size-4 text-white" />
            )}
          </span>

          {/* Tramo horizontal del card del hito hasta la columna de cambios
              (lg+). Solo se dibuja cuando hay cambios para conectar. */}
          {changes.length > 0 ? (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-[-12px] hidden lg:block h-0.5 w-3 z-0",
                tone.connector
              )}
              aria-hidden
            />
          ) : null}

          <div
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-card-dense)] border bg-white shadow-[var(--shadow-card-dense)]",
              tone.card
            )}
          >
            <span className={cn("absolute inset-y-0 left-0 w-1.5", tone.accent)} />
            <div className="space-y-1.5 px-5 py-4 pl-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", tone.badge)}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-base font-semibold text-slate-950">{milestone.title}</p>
              <p className="text-sm leading-relaxed text-slate-600">{milestone.summary}</p>
              <div className="flex items-start gap-1.5 pt-1 text-slate-500">
                <CalendarDays className="mt-0.5 size-3.5" />
                <div className="leading-tight">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Aproximadamente
                  </p>
                  <p className="text-[12px] font-medium">{formatShortDate(milestone.date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conector (cell vacío del grid, ahora puramente espaciador) */}
      <div className="hidden lg:block" aria-hidden />

      {/* Columna derecha: cambios del hito */}
      <div className="relative pl-9">
        {/* Trunk vertical (lg+): cubre el alto de la fila y se divide hacia
            cada cambio mediante sus branches horizontales. */}
        {changes.length > 0 ? (
          <span
            className={cn(
              "absolute left-[-12px] inset-y-0 hidden lg:block w-0.5 z-0",
              tone.connector
            )}
            aria-hidden
          />
        ) : null}

        {changes.length === 0 ? (
          <div className="flex h-full items-center rounded-[var(--radius-card-dense)] border border-dashed border-slate-200 bg-white/40 px-4 py-3 text-xs text-slate-500">
            Sin cambios aceptados para este hito.
          </div>
        ) : (
          <div className="space-y-3">
            {changes.map((change) => (
              <ChangeRequestCard
                key={change.id}
                change={change}
                phase={phase}
                connectorClass={tone.connector}
                isCurrentMilestone={milestone.status === "current"}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ChangeRequestCard({
  change,
  phase,
  connectorClass,
  isCurrentMilestone
}: {
  change: ChangeRequestRecord;
  phase: MilestonePhase;
  connectorClass: string;
  isCurrentMilestone: boolean;
}) {
  const inProgress = change.status === "in_review";
  const highlight = inProgress && isCurrentMilestone;

  // El gradiente del círculo del cambio espeja la fase (columna del kanban)
  // del hito al que pertenece, así ambos comparten color y se actualizan
  // juntos cuando el PM mueve el hito a otra columna.
  const nodeGradient = PHASE_THEME[phase].node;

  // La prioridad sólo afecta el color del texto "Prioridad para modificar".
  // Baja se muestra en verde (criterio visual del cliente).
  const priorityValueClass =
    change.priority === "high"
      ? "text-error-700"
      : change.priority === "medium"
        ? "text-yellow-700"
        : "text-success-700";

  const priorityLabel =
    change.priority === "high" ? "Alta" : change.priority === "medium" ? "Media" : "Baja";

  const statusLabel =
    change.status === "planned"
      ? "Aceptado"
      : change.status === "in_review"
        ? "En progreso"
        : change.status === "done"
          ? "Implementado"
          : change.status === "rejected"
            ? "Rechazado"
            : "Pendiente";
  const statusValueClass =
    change.status === "planned"
      ? "text-success-700"
      : change.status === "in_review"
        ? "text-[var(--role-strong,#224a78)]"
        : change.status === "done"
          ? "text-slate-600"
          : change.status === "rejected"
            ? "text-error-700"
            : "text-warning-700";

  const typeLabel = change.changeType ? CHANGE_TYPE_LABEL[change.changeType] : "Por identificar";
  const typeValueClass = change.changeType ? "text-slate-900" : "text-slate-500 italic";

  return (
    <div className="relative">
      {/* Branch horizontal (lg+): conecta el trunk al círculo del cambio. */}
      <span
        className={cn(
          "absolute left-[-48px] top-1/2 -translate-y-1/2 hidden lg:block h-0.5 w-5 z-0",
          connectorClass
        )}
        aria-hidden
      />

      <span
        className={cn(
          "absolute -left-7 top-1/2 -translate-y-1/2 grid size-6 place-items-center rounded-full z-10",
          nodeGradient
        )}
      >
        <Pencil className="size-3 text-white" strokeWidth={2.2} />
      </span>

      <div
        className={cn(
          "rounded-[var(--radius-card-dense)] border bg-white",
          highlight ? "border-[var(--role,#5e92c2)]" : "border-slate-200"
        )}
      >
        <div className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-950">{change.title}</p>
            <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">{change.detail}</p>
            {highlight ? (
              <span className="inline-flex w-fit rounded-full bg-[var(--role-strong,#224a78)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                En este hito
              </span>
            ) : null}
          </div>

          <dl className="flex flex-col gap-1 text-[11px] sm:text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <dt className="font-semibold uppercase tracking-[0.1em] text-slate-400">
                Prioridad para modificar:
              </dt>
              <dd className={cn("font-semibold", priorityValueClass)}>{priorityLabel}</dd>
            </div>
            <div className="flex items-baseline justify-end gap-1.5">
              <dt className="font-semibold uppercase tracking-[0.1em] text-slate-400">Estado:</dt>
              <dd className={cn("font-semibold", statusValueClass)}>{statusLabel}</dd>
            </div>
            <div className="flex items-baseline justify-end gap-1.5">
              <dt className="font-semibold uppercase tracking-[0.1em] text-slate-400">Tipo:</dt>
              <dd className={cn("font-semibold", typeValueClass)}>{typeLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function NewChangeRequestDialog({
  project,
  milestones
}: {
  project: { id: string; name: string; clientId: string; clientName: string; pmId: string };
  milestones: ProjectMilestoneRecord[];
}) {
  const { addChangeRequest } = useDashboardWorkspace();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [submitting, setSubmitting] = useState(false);

  const currentMilestone = milestones.find((m) => m.status === "current");

  async function handleSubmit() {
    if (!title.trim() || !detail.trim()) {
      toast.error("Faltan datos", { description: "Necesitamos título y descripción." });
      return;
    }

    setSubmitting(true);

    try {
      await addChangeRequest({
        projectId: project.id,
        clientId: project.clientId,
        title: title.trim(),
        detail: detail.trim(),
        priority
      });
    } catch (error) {
      toast.error("No se pudo registrar el cambio", {
        description: error instanceof Error ? error.message : undefined
      });
      setSubmitting(false);
      return;
    }

    try {
      await sendDashboardNotification({
        type: "change_request",
        projectId: project.id,
        title: title.trim(),
        detail: detail.trim(),
        priority
      });

      toast.success("Cambio solicitado", {
        description: "Tu PM lo revisará y decidirá si lo acepta."
      });
    } catch (error) {
      toast.warning("Quedó registrado pero no enviamos email", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setOpen(false);
      setTitle("");
      setDetail("");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-role">
          <Plus className="size-4" />
          Solicitar cambio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar un cambio</DialogTitle>
          <DialogDescription>
            Tu PM lo verá inmediatamente. Sé claro con el qué y el por qué.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="rounded-[12px] bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {currentMilestone ? (
              <>
                Se asignará al hito en curso: <span className="font-semibold text-slate-900">{currentMilestone.title}</span>
              </>
            ) : (
              "No hay un hito en curso ahora mismo. El cambio quedará registrado y tu PM lo asignará al aceptarlo."
            )}
          </div>

          <TextField label="Título" placeholder="Ej. Ajustar prioridad del bloque comercial" value={title} onChange={setTitle} />

          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select value={priority} onValueChange={(v: "high" | "medium" | "low") => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TextAreaField
            label="Descripción"
            placeholder="Describe el cambio y el motivo."
            rows={5}
            value={detail}
            onChange={setDetail}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button className="btn-role" onClick={handleSubmit} disabled={submitting}>
            <Send className="size-4" />
            {submitting ? "Enviando…" : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MilestoneStatChip({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: number;
  tone?: "neutral" | "info" | "success";
}) {
  const toneCls =
    tone === "success"
      ? "bg-success-50 text-success-700"
      : tone === "info"
        ? "bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]"
        : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium ${toneCls}`}>
      <span className="font-semibold">{value}</span>
      <span className="text-sm opacity-80">{label}</span>
    </span>
  );
}
