"use client";

import { CheckCircle2, Circle, Clock, MoreHorizontal, Pencil, Plus, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TextAreaField, TextField } from "@/components/common/form-field";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import { resolvePaymentMilestoneState } from "@/features/dashboard/components/shared/payments-panel";
import {
  getMilestonePayment,
  getProjectChangeRequests,
  getProjectMilestones,
  getSelectedOrPrimaryProject,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import type { ProjectMilestoneRecord } from "@/lib/types/domain";
import { formatLongDate, formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

type MilestoneStatus = "done" | "current" | "next";

const EMPTY_FORM = {
  title: "",
  summary: "",
  date: "",
  status: "next" as MilestoneStatus
};

export function PmStatusPanel() {
  const { state, completeMilestone, saveMilestone } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, "pm");
  const projects = getVisibleProjects(state, "pm");
  const milestones = useMemo(
    () =>
      getProjectMilestones(state, project?.id)
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [state, project?.id]
  );
  const changes = getProjectChangeRequests(state, project?.id);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formProjectId, setFormProjectId] = useState(project?.id ?? "");

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormProjectId(project?.id ?? "");
    setSheetOpen(true);
  }

  function openEdit(m: ProjectMilestoneRecord) {
    setEditingId(m.id);
    setForm({ title: m.title, summary: m.summary, date: m.date, status: m.status });
    setFormProjectId(m.projectId);
    setSheetOpen(true);
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.summary.trim() || !form.date) {
      toast.error("Faltan datos", { description: "Necesitamos título, descripción y fecha." });
      return;
    }
    saveMilestone({
      id: editingId ?? undefined,
      projectId: formProjectId,
      title: form.title.trim(),
      summary: form.summary.trim(),
      date: form.date,
      status: form.status
    });
    toast.success(editingId ? "Hito actualizado" : "Hito creado");
    setSheetOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  if (!project) {
    return (
      <DashboardEmptyState
        title="Selecciona un proyecto"
        body="La gestión de hitos depende del proyecto activo en la sección Proyectos."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#4f9792)]">
              Status board
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Cliente: {project.clientName} · {milestones.length} hitos · entrega {formatLongDate(project.dueDate)}
            </p>
          </div>
          <Button className="btn-role" onClick={openCreate}>
            <Plus className="size-4" />
            Nuevo hito
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-3">
          {milestones.length === 0 ? (
            <DashboardEmptyState
              title="Sin hitos"
              body="Crea el primero para empezar a coordinar avance y pagos."
            />
          ) : (
            milestones.map((m) => {
              const payment = getMilestonePayment(state, m.id);
              const paymentState = resolvePaymentMilestoneState(m.status, payment?.status);
              return (
                <article
                  key={m.id}
                  className={cn(
                    "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
                    m.status === "current" && "border-[var(--role,#68b8b2)]/40"
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
                              ? "bg-[var(--role-soft,#eafaf7)] text-[var(--role-strong,#4f9792)]"
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-950">{m.title}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {m.status === "done" ? "Completado" : m.status === "current" ? "En curso" : "Pendiente"}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                          <span>{formatShortDate(m.date)}</span>
                          {payment ? (
                            <>
                              <span>·</span>
                              <span>
                                {payment.label}: {formatCurrency(payment.amount)} ({paymentState.label})
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {m.status !== "done" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              completeMilestone(m.id);
                              toast.success("Hito completado");
                            }}
                          >
                            <CheckCircle2 className="size-4" />
                            Marcar completado
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={() => openEdit(m)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="space-y-3">
          <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card-dense)]">
            <div className="flex items-center justify-between">
              <p className="kpi-label">Cambios del cliente</p>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                {changes.length}
              </Badge>
            </div>
            {changes.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Sin solicitudes pendientes.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {changes.map((c) => {
                  const tone =
                    c.priority === "high"
                      ? "badge-status-error"
                      : c.priority === "medium"
                        ? "badge-status-warning"
                        : "badge-status-info";
                  return (
                    <li key={c.id} className="rounded-[12px] border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-950">{c.title}</p>
                        <span className={tone}>{c.priority}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">{c.detail}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingId ? "Editar hito" : "Nuevo hito"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Actualiza el detalle del hito existente."
                : "Crea un hito para sincronizar avance y pagos."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-4 py-3">
            <div className="space-y-2">
              <Label>Proyecto</Label>
              <Select value={formProjectId} onValueChange={setFormProjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TextField
              label="Título"
              placeholder="Ej. Validación de sprint"
              value={form.title}
              onChange={(v) => setForm((c) => ({ ...c, title: v }))}
            />
            <TextAreaField
              label="Descripción"
              placeholder="Describe el objetivo del hito"
              rows={4}
              value={form.summary}
              onChange={(v) => setForm((c) => ({ ...c, summary: v }))}
            />
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v: MilestoneStatus) => setForm((c) => ({ ...c, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next">Pendiente</SelectItem>
                  <SelectItem value="current">En curso</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              <X className="size-4" />
              Cancelar
            </Button>
            <Button className="btn-role" onClick={handleSubmit}>
              <Save className="size-4" />
              {editingId ? "Guardar" : "Crear"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
