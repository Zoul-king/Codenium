"use client";

import { CalendarDays, CheckCircle2, Circle, Clock, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
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
import type { ChangeRequestRecord, ProjectMilestoneRecord } from "@/lib/types/domain";
import { formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

export function ClientMilestonesPanel() {
  const { state, refreshChangeRequests } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, "client");
  const milestones = (getProjectMilestones(state, project?.id) ?? [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const changes = getProjectChangeRequests(state, project?.id);

  // Mantiene los cambios sincronizados con la DB: el PM puede aceptar/rechazar
  // desde su panel y necesitamos reflejarlo aquí sin recargar la página.
  useEffect(() => {
    refreshChangeRequests();
    const interval = window.setInterval(refreshChangeRequests, 15000);
    const onFocus = () => refreshChangeRequests();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refreshChangeRequests]);

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
          <MilestoneAndChangesTimeline items={milestones} changes={changes} />
        </TabsContent>
        <TabsContent value="current" className="mt-6">
          <MilestoneAndChangesTimeline items={current} changes={changes} />
        </TabsContent>
        <TabsContent value="done" className="mt-6">
          <MilestoneAndChangesTimeline items={done} changes={changes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MilestoneAndChangesTimeline({
  items,
  changes
}: {
  items: ProjectMilestoneRecord[];
  changes: ChangeRequestRecord[];
}) {
  if (items.length === 0) {
    return (
      <DashboardEmptyState
        title="Sin hitos"
        body="No hay hitos en esta categoría todavía."
      />
    );
  }

  // El cliente solo ve cambios que el PM ya procesó (aceptados, en progreso o
  // implementados); los nuevos y rechazados se ocultan.
  const isVisibleToClient = (c: ChangeRequestRecord) =>
    c.status === "planned" || c.status === "in_review" || c.status === "done";

  const visibleChanges = changes.filter(isVisibleToClient);
  const milestoneIds = new Set(items.map((m) => m.id));
  const generalChanges = visibleChanges.filter(
    (c) => !c.milestoneId || !milestoneIds.has(c.milestoneId)
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] lg:gap-0">
      <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Hitos
      </div>
      <div className="hidden lg:block" />
      <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Cambios solicitados
      </div>

      {generalChanges.length > 0 ? (
        <GeneralChangesRow changes={generalChanges} />
      ) : null}

      {items.map((m) => {
        const milestoneChanges = visibleChanges.filter((c) => c.milestoneId === m.id);
        return (
          <MilestoneRow key={m.id} milestone={m} changes={milestoneChanges} />
        );
      })}
    </div>
  );
}

function GeneralChangesRow({ changes }: { changes: ChangeRequestRecord[] }) {
  return (
    <>
      <div className="relative pl-14">
        <span className="absolute left-[27px] inset-y-0 w-0.5 bg-slate-200" aria-hidden />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-slate-400 ring-4 ring-slate-100 z-10">
          <CalendarDays className="size-5 text-white" />
        </span>
        <div className="relative overflow-hidden rounded-[var(--radius-card-dense)] border border-slate-200 bg-white shadow-[var(--shadow-card-dense)]">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-slate-400" />
          <div className="space-y-1.5 px-5 py-4 pl-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                General
              </span>
            </div>
            <p className="text-base font-semibold text-slate-950">Cambios sin hito específico</p>
            <p className="text-sm leading-relaxed text-slate-600">
              Solicitudes que no quedaron asociadas a un hito en particular.
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center">
        <span className="h-0.5 w-full bg-slate-300" />
      </div>

      <div className="relative pl-9">
        <span className="absolute left-[15px] inset-y-0 w-0.5 bg-slate-200" aria-hidden />
        <div className="space-y-3">
          {changes.map((change) => (
            <ChangeRequestCard key={change.id} change={change} isCurrentMilestone={false} />
          ))}
        </div>
      </div>
    </>
  );
}

function MilestoneRow({
  milestone,
  changes
}: {
  milestone: ProjectMilestoneRecord;
  changes: ChangeRequestRecord[];
}) {
  const tone =
    milestone.status === "done"
      ? {
          node: "bg-success-500",
          ring: "ring-success-100",
          card: "border-success-200 bg-success-50/40",
          accent: "bg-success-500",
          badge: "bg-success-100 text-success-700",
          connector: "bg-success-300"
        }
      : milestone.status === "current"
        ? {
            node: "bg-[var(--role-strong,#224a78)]",
            ring: "ring-[var(--role,#5e92c2)]/30",
            card: "border-[var(--role,#5e92c2)]/40 bg-[var(--role-soft,#eff6fb)]",
            accent: "bg-[var(--role-strong,#224a78)]",
            badge: "bg-[var(--role,#5e92c2)]/20 text-[var(--role-strong,#224a78)]",
            connector: "bg-[var(--role,#5e92c2)]"
          }
        : {
            node: "bg-slate-300",
            ring: "ring-slate-100",
            card: "border-slate-200 bg-white",
            accent: "bg-slate-300",
            badge: "bg-slate-100 text-slate-600",
            connector: "bg-slate-300"
          };

  const statusLabel =
    milestone.status === "done" ? "Completado" : milestone.status === "current" ? "En curso" : "Pendiente";

  return (
    <>
      {/* Columna izquierda: hito */}
      <div className="relative pl-14">
        <span className="absolute left-[27px] inset-y-0 w-0.5 bg-slate-200" aria-hidden />
        <span
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full ring-4 z-10",
            tone.node,
            tone.ring
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

      {/* Conector horizontal (solo lg+) */}
      <div className="relative hidden lg:flex items-center justify-center">
        <span className={cn("h-0.5 w-full", changes.length > 0 ? tone.connector : "bg-slate-200")} />
      </div>

      {/* Columna derecha: cambios del hito */}
      <div className="relative pl-9">
        {changes.length > 0 ? (
          <span className="absolute left-[15px] inset-y-0 w-0.5 bg-slate-200" aria-hidden />
        ) : null}

        {changes.length === 0 ? (
          <div className="flex h-full items-center rounded-[var(--radius-card-dense)] border border-dashed border-slate-200 bg-white/40 px-4 py-3 text-xs text-slate-500">
            Sin cambios aceptados para este hito.
          </div>
        ) : (
          <div className="space-y-3">
            {changes.map((change) => (
              <ChangeRequestCard key={change.id} change={change} isCurrentMilestone={milestone.status === "current"} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ChangeRequestCard({ change, isCurrentMilestone }: { change: ChangeRequestRecord; isCurrentMilestone: boolean }) {
  const inProgress = change.status === "in_review";
  const highlight = inProgress && isCurrentMilestone;
  const tone =
    change.priority === "high"
      ? {
          node: "bg-error-500",
          ring: "ring-error-100",
          accent: "bg-error-500",
          badge: "bg-error-50 text-error-700"
        }
      : change.priority === "medium"
        ? {
            node: "bg-warning-500",
            ring: "ring-warning-100",
            accent: "bg-warning-500",
            badge: "bg-warning-50 text-warning-700"
          }
        : {
            node: "bg-[var(--role-strong,#224a78)]",
            ring: "ring-[var(--role,#5e92c2)]/20",
            accent: "bg-[var(--role-strong,#224a78)]",
            badge: "bg-[var(--role,#5e92c2)]/15 text-[var(--role-strong,#224a78)]"
          };

  const priorityLabel =
    change.priority === "high" ? "Alta" : change.priority === "medium" ? "Media" : "Baja";

  const statusLabel =
    change.status === "planned"
      ? "Aceptado"
      : change.status === "in_review"
        ? "En progreso"
        : change.status === "done"
          ? "Implementado"
          : change.status;
  const statusBadge =
    change.status === "planned"
      ? "bg-success-50 text-success-700"
      : change.status === "in_review"
        ? "bg-[var(--role,#5e92c2)]/15 text-[var(--role-strong,#224a78)]"
        : "bg-slate-100 text-slate-600";

  return (
    <div className="relative">
      <span
        className={cn(
          "absolute -left-7 top-3 grid size-6 place-items-center rounded-full ring-4 z-10",
          tone.node,
          tone.ring
        )}
      >
        <span className="size-1.5 rounded-full bg-white" />
      </span>

      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card-dense)] border bg-white",
          highlight ? "border-[var(--role,#5e92c2)] ring-2 ring-[var(--role,#5e92c2)]/25" : "border-slate-200"
        )}
      >
        <span className={cn("absolute inset-y-0 left-0 w-1", tone.accent)} />
        <div className="space-y-1.5 px-4 py-3 pl-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", tone.badge)}>
              {priorityLabel}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", statusBadge)}>
              {statusLabel}
            </span>
            {highlight ? (
              <span className="rounded-full bg-[var(--role-strong,#224a78)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                En este hito
              </span>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-slate-950">{change.title}</p>
          <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">{change.detail}</p>
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
  const { state, addChangeRequest } = useDashboardWorkspace();
  const [open, setOpen] = useState(false);
  // El cambio siempre se ata a un hito. Por defecto sugerimos el hito en curso
  // o el primero disponible.
  const defaultMilestoneId =
    milestones.find((m) => m.status === "current")?.id ?? milestones[0]?.id ?? "";
  const [milestoneId, setMilestoneId] = useState(defaultMilestoneId);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [submitting, setSubmitting] = useState(false);

  // Mantener la sugerencia inicial sincronizada si los hitos llegan después
  // del render inicial.
  useEffect(() => {
    if (!milestoneId && defaultMilestoneId) {
      setMilestoneId(defaultMilestoneId);
    }
  }, [defaultMilestoneId, milestoneId]);

  async function handleSubmit() {
    if (!title.trim() || !detail.trim()) {
      toast.error("Faltan datos", { description: "Necesitamos título y descripción." });
      return;
    }
    if (!milestoneId) {
      toast.error("Falta el hito", { description: "Selecciona el hito al que pertenece el cambio." });
      return;
    }

    setSubmitting(true);

    try {
      await addChangeRequest({
        projectId: project.id,
        clientId: project.clientId,
        milestoneId,
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
      setMilestoneId(defaultMilestoneId);
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
          <div className="space-y-2">
            <Label>Hito relacionado</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el hito" />
              </SelectTrigger>
              <SelectContent>
                {milestones.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">
                    Aún no hay hitos definidos en el proyecto.
                  </div>
                ) : (
                  milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
