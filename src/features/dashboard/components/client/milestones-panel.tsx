"use client";

import { CheckCircle2, Circle, Clock, Plus, Send } from "lucide-react";
import { useState } from "react";
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
import type { ProjectMilestoneRecord } from "@/lib/types/domain";
import { formatLongDate, formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

export function ClientMilestonesPanel() {
  const { state } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, "client");
  const milestones = (getProjectMilestones(state, project?.id) ?? [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const changes = getProjectChangeRequests(state, project?.id);

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
  const next = milestones.filter((m) => m.status === "next");

  return (
    <div className="space-y-6">
      <header className="warm-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#224a78)]">
            Roadmap
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {done.length} de {milestones.length} hitos completados · entrega estimada {formatLongDate(project.dueDate)}
          </p>
        </div>
        <NewChangeRequestDialog project={project} milestones={milestones} />
      </header>

      <Tabs defaultValue="all">
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="all">Todos ({milestones.length})</TabsTrigger>
          <TabsTrigger value="current">En curso ({current.length})</TabsTrigger>
          <TabsTrigger value="next">Próximos ({next.length})</TabsTrigger>
          <TabsTrigger value="done">Completados ({done.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MilestoneList items={milestones} />
        </TabsContent>
        <TabsContent value="current" className="mt-6">
          <MilestoneList items={current} />
        </TabsContent>
        <TabsContent value="next" className="mt-6">
          <MilestoneList items={next} />
        </TabsContent>
        <TabsContent value="done" className="mt-6">
          <MilestoneList items={done} />
        </TabsContent>
      </Tabs>

      <section className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Cambios solicitados
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Tu historial</h2>
          </div>
          <span className="text-xs text-slate-500">{changes.length} en total</span>
        </div>

        {changes.length === 0 ? (
          <div className="mt-5">
            <DashboardEmptyState
              title="Sin cambios solicitados"
              body="Cuando registres uno, lo verás aquí junto con su estado y prioridad."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {changes.map((change) => {
              const tone =
                change.priority === "high"
                  ? "badge-status-error"
                  : change.priority === "medium"
                    ? "badge-status-warning"
                    : "badge-status-info";
              return (
                <article
                  key={change.id}
                  className="rounded-[16px] border border-slate-200 p-4 transition hover:border-[var(--role,#5e92c2)]/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">{change.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{change.detail}</p>
                    </div>
                    <span className={tone}>{change.priority}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span>{change.milestoneId ? "Asociado a un hito" : "Asociado al proyecto"}</span>
                    <span>·</span>
                    <span>Estado: {change.status}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function MilestoneList({ items }: { items: ProjectMilestoneRecord[] }) {
  if (items.length === 0) {
    return (
      <DashboardEmptyState
        title="Sin hitos"
        body="No hay hitos en esta categoría todavía."
      />
    );
  }

  return (
    <ol className="space-y-3">
      {items.map((m) => (
        <li
          key={m.id}
          className={cn(
            "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
            m.status === "current" && "border-[var(--role,#5e92c2)]/40 ring-1 ring-[var(--role,#5e92c2)]/20"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-8 place-items-center rounded-full",
                  m.status === "done"
                    ? "bg-success-50 text-success-600"
                    : m.status === "current"
                      ? "bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]"
                      : "bg-slate-100 text-slate-400"
                )}
              >
                {m.status === "done" ? (
                  <CheckCircle2 className="size-4" />
                ) : m.status === "current" ? (
                  <Clock className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-950">{m.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.summary}</p>
              </div>
            </div>
            <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {formatShortDate(m.date)}
            </span>
          </div>
        </li>
      ))}
    </ol>
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
  const [milestoneId, setMilestoneId] = useState("project");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !detail.trim()) {
      toast.error("Faltan datos", { description: "Necesitamos título y descripción." });
      return;
    }

    setSubmitting(true);
    const selectedMilestone = milestones.find((m) => m.id === milestoneId);
    const composedDetail = selectedMilestone
      ? `${detail.trim()}\n\nHito relacionado: ${selectedMilestone.title}`
      : detail.trim();

    addChangeRequest({
      projectId: project.id,
      clientId: project.clientId,
      milestoneId: selectedMilestone?.id,
      title: title.trim(),
      detail: composedDetail,
      priority
    });

    try {
      await sendDashboardNotification({
        type: "change_request",
        projectId: project.id,
        title: title.trim(),
        detail: composedDetail,
        priority
      });

      toast.success("Cambio solicitado", {
        description: "Tu PM recibirá una notificación."
      });
      setOpen(false);
      setTitle("");
      setDetail("");
      setMilestoneId("project");
    } catch (error) {
      toast.error("Quedó registrado pero no enviamos email", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
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
            <Label>Asociar a</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Proyecto completo</SelectItem>
                {milestones.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title}
                  </SelectItem>
                ))}
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
