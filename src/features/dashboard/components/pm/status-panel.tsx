"use client";

import { CheckCircle2, Circle, Clock, MoreHorizontal, Pencil, Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import type { ChangeRequestRecord, ChangeRequestType, ProjectMilestoneRecord } from "@/lib/types/domain";

const CHANGE_TYPE_OPTIONS: Array<{ value: ChangeRequestType; label: string }> = [
  { value: "visual", label: "Visual" },
  { value: "funcional", label: "Funcional" },
  { value: "contenido", label: "Contenido" },
  { value: "tecnico", label: "Técnico" },
  { value: "bugfix", label: "Corrección" },
  { value: "otro", label: "Otro" }
];
import { formatShortDate } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

type MilestoneStatus = "done" | "current" | "next";

const EMPTY_FORM = {
  title: "",
  summary: "",
  date: "",
  status: "next" as MilestoneStatus
};

export function PmStatusPanel() {
  const { state, completeMilestone, saveMilestone, refreshChangeRequests } = useDashboardWorkspace();

  // Refresca las solicitudes del cliente periódicamente / al volver al tab
  // para que el PM las vea sin tener que recargar la página. Ref pattern para
  // no atar el interval a la identidad de refreshChangeRequests, que cambia
  // cada vez que el store recompone su value memoizado.
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
  const projects = getVisibleProjects(state, "pm");

  // La selección de cliente/proyecto vive ahora en el store (compartida con la
  // pantalla de Proyectos del PM). Aquí solo mostramos como texto qué fue
  // seleccionado — sin selectores duplicados.
  const project = getSelectedOrPrimaryProject(state, "pm");

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
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Cuando cambian los hitos del proyecto, asegúrate de que el seleccionado
  // siga siendo válido.
  useEffect(() => {
    if (selectedMilestoneId && !milestones.some((m) => m.id === selectedMilestoneId)) {
      setSelectedMilestoneId(null);
    }
  }, [milestones, selectedMilestoneId]);

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) ?? null;
  const changesForSelected = selectedMilestoneId
    ? changes.filter((c) => c.milestoneId === selectedMilestoneId)
    : [];

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

  async function handleSubmit() {
    if (!form.title.trim() || !form.summary.trim() || !form.date) {
      toast.error("Faltan datos", { description: "Necesitamos título, descripción y fecha." });
      return;
    }
    try {
      await saveMilestone({
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
    } catch (error) {
      toast.error("No se pudo guardar el hito", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Cliente:
            </span>
            <span className="font-semibold text-slate-900">
              {project?.clientName ?? "Sin selección"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Proyecto:
            </span>
            <span className="font-semibold text-slate-900">
              {project?.name ?? "Sin selección"}
            </span>
          </div>
        </div>
        {project ? (
          <Button className="btn-role" onClick={openCreate}>
            <Plus className="size-4" />
            Nuevo hito
          </Button>
        ) : null}
      </div>

      {!project ? (
        <DashboardEmptyState
          title="Selecciona un cliente y un proyecto"
          body="Una vez elegidos verás los hitos, su estado y las solicitudes de cambio."
        />
      ) : (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <section className="space-y-2">
          {milestones.length === 0 ? (
            <DashboardEmptyState
              title="Sin hitos"
              body="Crea el primero para empezar a coordinar avance y pagos."
            />
          ) : (
            milestones.map((m) => {
              const isSelected = m.id === selectedMilestoneId;
              return (
                <div key={m.id} className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneId(isSelected ? null : m.id)}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-[var(--radius-card-dense)] border bg-white px-3 py-2.5 text-left shadow-[var(--shadow-card-dense)] transition",
                      isSelected
                        ? "border-[var(--role-strong,#4f9792)] ring-1 ring-[var(--role,#68b8b2)]"
                        : "border-slate-200 hover:border-[var(--role,#68b8b2)]/50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full",
                        m.status === "done"
                          ? "bg-success-50 text-success-600"
                          : m.status === "current"
                            ? "bg-[var(--role-soft,#eafaf7)] text-[var(--role-strong,#4f9792)]"
                            : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {m.status === "done" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : m.status === "current" ? (
                        <Clock className="size-3.5" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-950">{m.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Entrega aprox.: {formatShortDate(m.date)}
                      </p>
                    </div>
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="shrink-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {m.status !== "done" ? (
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              await completeMilestone(m.id);
                              toast.success("Hito completado");
                            } catch (error) {
                              toast.error("No se pudo completar el hito", {
                                description: error instanceof Error ? error.message : undefined
                              });
                            }
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
              );
            })
          )}
        </section>

        <aside className="space-y-3">
          {selectedMilestone ? (
            <>
              <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card-dense)]">
                <p className="kpi-label">Información del hito</p>
                {selectedMilestone.summary ? (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{selectedMilestone.summary}</p>
                ) : (
                  <p className="mt-2 text-xs italic text-slate-400">Sin descripción.</p>
                )}
                {(() => {
                  const payment = getMilestonePayment(state, selectedMilestone.id);
                  const paymentState = resolvePaymentMilestoneState(selectedMilestone.status, payment?.status);
                  return payment ? (
                    <p className="mt-2 text-[11px] text-slate-500">
                      {payment.label}: {formatCurrency(payment.amount)} ({paymentState.label})
                    </p>
                  ) : null;
                })()}
              </div>
              <ChangeRequestsBoard changes={changesForSelected} />
            </>
          ) : (
            <div className="rounded-[var(--radius-card-dense)] border border-dashed border-slate-200 bg-white/40 px-4 py-8 text-center text-xs text-slate-500">
              Selecciona un hito para ver sus cambios asociados.
            </div>
          )}
        </aside>
      </div>
      )}

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

function ChangeRequestsBoard({ changes }: { changes: ChangeRequestRecord[] }) {
  const { updateChangeRequestStatus, updateChangeRequestType } = useDashboardWorkspace();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function setStatus(id: string, status: ChangeRequestRecord["status"]) {
    setPendingId(id);
    try {
      await updateChangeRequestStatus(id, status);
      const labels: Record<typeof status, string> = {
        new: "marcado como nuevo",
        in_review: "marcado en progreso",
        planned: "aceptado",
        done: "marcado como implementado",
        rejected: "rechazado"
      } as Record<typeof status, string>;
      toast.success(`Cambio ${labels[status]}`);
    } catch (error) {
      toast.error("No se pudo actualizar el cambio", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setPendingId(null);
    }
  }

  async function setType(id: string, changeType: ChangeRequestType) {
    setPendingId(id);
    try {
      await updateChangeRequestType(id, changeType);
      toast.success("Tipo de cambio actualizado");
    } catch (error) {
      toast.error("No se pudo actualizar el tipo", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setPendingId(null);
    }
  }

  return (
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
        <ul className="mt-3 space-y-3">
          {changes.map((c) => {
            const priorityTone =
              c.priority === "high"
                ? "badge-status-error"
                : c.priority === "medium"
                  ? "badge-status-warning"
                  : "badge-status-info";
            const statusLabel = changeStatusLabel(c.status);
            const isBusy = pendingId === c.id;
            return (
              <li key={c.id} className="rounded-[12px] border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-950">{c.title}</p>
                  <span className={priorityTone}>{c.priority}</span>
                </div>
                <p className="mt-1 line-clamp-3 text-[11px] text-slate-600">{c.detail}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className={changeStatusBadgeClass(c.status)}>{statusLabel}</span>
                </div>

                <div className="mt-3 space-y-1">
                  <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tipo de cambio
                  </Label>
                  <Select
                    value={c.changeType ?? ""}
                    onValueChange={(v) => setType(c.id, v as ChangeRequestType)}
                    disabled={isBusy}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Sin clasificar" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANGE_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.status === "new" ? (
                    <>
                      <Button
                        size="xs"
                        className="btn-role"
                        disabled={isBusy}
                        onClick={() => setStatus(c.id, "planned")}
                      >
                        Aceptar
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        className="border-error-500/40 text-error-700 hover:bg-error-50"
                        disabled={isBusy}
                        onClick={() => setStatus(c.id, "rejected")}
                      >
                        Rechazar
                      </Button>
                    </>
                  ) : null}
                  {c.status === "planned" ? (
                    <Button
                      size="xs"
                      className="btn-role"
                      disabled={isBusy}
                      onClick={() => setStatus(c.id, "in_review")}
                    >
                      Iniciar trabajo
                    </Button>
                  ) : null}
                  {c.status === "in_review" ? (
                    <Button
                      size="xs"
                      className="btn-role"
                      disabled={isBusy}
                      onClick={() => setStatus(c.id, "done")}
                    >
                      Marcar implementado
                    </Button>
                  ) : null}
                  {(c.status === "rejected" || c.status === "done") ? (
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => setStatus(c.id, "new")}
                    >
                      Reabrir
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function changeStatusLabel(status: ChangeRequestRecord["status"]): string {
  switch (status) {
    case "new":
      return "Pendiente";
    case "in_review":
      return "En progreso";
    case "planned":
      return "Aceptado";
    case "done":
      return "Implementado";
    case "rejected":
      return "Rechazado";
  }
}

function changeStatusBadgeClass(status: ChangeRequestRecord["status"]): string {
  switch (status) {
    case "new":
      return "badge-status-warning";
    case "in_review":
      return "badge-status-info";
    case "planned":
      return "badge-status-success";
    case "done":
      return "badge-status-neutral";
    case "rejected":
      return "badge-status-error";
  }
}
