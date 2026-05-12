"use client";

import { CheckCircle2, Circle, Clock, MoreHorizontal, Pencil, Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import type { ChangeRequestRecord, ProjectMilestoneRecord } from "@/lib/types/domain";
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
  const { state, completeMilestone, saveMilestone, selectProject, refreshChangeRequests } = useDashboardWorkspace();

  // Refresca las solicitudes del cliente periódicamente / al volver al tab
  // para que el PM las vea sin tener que recargar la página.
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
  const projects = getVisibleProjects(state, "pm");

  // El PM ve solo los clientes de los proyectos que tiene asignados.
  const clientsForPm = useMemo(() => {
    const byId = new Map<string, { id: string; name: string }>();
    for (const p of projects) {
      if (!byId.has(p.clientId)) byId.set(p.clientId, { id: p.clientId, name: p.clientName });
    }
    return Array.from(byId.values());
  }, [projects]);

  const autoProject = getSelectedOrPrimaryProject(state, "pm");
  const [selectedClientId, setSelectedClientId] = useState<string>(autoProject?.clientId ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(autoProject?.id ?? "");

  const projectsForClient = useMemo(
    () => projects.filter((p) => p.clientId === selectedClientId),
    [projects, selectedClientId]
  );

  const project = projects.find((p) => p.id === selectedProjectId);

  function handleSelectClient(clientId: string) {
    setSelectedClientId(clientId);
    setSelectedProjectId("");
  }

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId);
    selectProject("pm", projectId);
  }

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
        <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-1 min-w-[220px] items-center gap-3">
            <Label className="whitespace-nowrap">Cliente</Label>
            <Select value={selectedClientId} onValueChange={handleSelectClient}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientsForPm.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Aún no tienes proyectos asignados.</div>
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
          <div className="flex flex-1 min-w-[260px] items-center gap-3">
            <Label className="whitespace-nowrap">Nombre del Proyecto</Label>
            <Select
              value={selectedProjectId}
              onValueChange={handleSelectProject}
              disabled={!selectedClientId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={selectedClientId ? "Selecciona un proyecto" : "Primero elige un cliente"} />
              </SelectTrigger>
              <SelectContent>
                {projectsForClient.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Sin proyectos para este cliente.</div>
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
                </article>
              );
            })
          )}
        </section>

        <aside className="space-y-3">
          <ChangeRequestsBoard changes={changes} />
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
  const { updateChangeRequestStatus } = useDashboardWorkspace();
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
