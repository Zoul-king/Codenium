"use client";

import { CheckCircle2, Filter, MoreHorizontal, Plus, UserCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextField, TextAreaField } from "@/components/common/form-field";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getClientUsers,
  getPmStats,
  getPmUsers,
  getUserById,
  getVisibleQuotes
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatCurrency } from "@/features/quotes/lib/estimate";
import { sendDashboardNotification } from "@/lib/api/client";
import type { QuoteRecord, QuoteStatus } from "@/lib/types/domain";
import { formatLongDate, formatShortDate, getQuoteStatusLabel } from "@/lib/utils/presenters";

const STATUS_FILTERS: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "accepted", label: "Aceptadas" },
  { value: "rejected", label: "Rechazadas" }
];

export function AdminQuotePanel() {
  const { state, acceptQuote, setQuoteStatus } = useDashboardWorkspace();
  const pmUsers = getPmUsers(state);
  const quotes = getVisibleQuotes(state, "admin");

  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [kindFilter, setKindFilter] = useState<"all" | "plan" | "service">("all");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [pmAssignment, setPmAssignment] = useState("");

  const stats = useMemo(() => {
    let plan = 0;
    let service = 0;
    let accepted = 0;
    let rejected = 0;
    let pending = 0;
    for (const q of quotes) {
      if (q.intakeSource === "plan") plan++;
      else if (q.intakeSource === "service") service++;
      if (q.status === "accepted") accepted++;
      else if (q.status === "rejected") rejected++;
      else if (q.status === "pending") pending++;
    }
    return { total: quotes.length, plan, service, accepted, rejected, pending };
  }, [quotes]);

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (kindFilter !== "all" && q.intakeSource !== kindFilter) return false;
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      return true;
    });
  }, [quotes, statusFilter, kindFilter]);

  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId) ?? null;

  function openDetail(q: QuoteRecord) {
    setSelectedQuoteId(q.id);
    setPmAssignment(q.pmId ?? "");
  }

  async function notifyStatus(quote: QuoteRecord, status: Exclude<QuoteStatus, "accepted">) {
    try {
      // Siempre actualiza el estado primero — no depende del email
      await setQuoteStatus(quote.id, status);

      const client = getUserById(state, quote.clientId);
      if (client?.email) {
        await sendDashboardNotification({
          type: "quote_status_update",
          recipientEmail: client.email,
          recipientName: client.name,
          quoteCode: quote.code,
          quoteTitle: quote.title,
          status
        });
      }

      toast.success(`Cotización marcada como ${getQuoteStatusLabel(status)}`);
    } catch (error) {
      toast.error("No se pudo actualizar la cotización", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  async function handleAccept() {
    if (!selectedQuote || !pmAssignment) return;
    try {
      await acceptQuote(selectedQuote.id, pmAssignment);
      const pm = getUserById(state, pmAssignment);
      const client = getUserById(state, selectedQuote.clientId);

      if (pm?.email && client?.email) {
        await sendDashboardNotification({
          type: "quote_assignment",
          quoteCode: selectedQuote.code,
          quoteTitle: selectedQuote.title,
          clientEmail: client.email,
          clientName: client.name,
          pmEmail: pm.email,
          pmName: pm.name,
          projectName: selectedQuote.title
        });
      }
      toast.success("Cotización convertida en proyecto");
      setSelectedQuoteId(null);
    } catch (error) {
      toast.error("No pudimos completar la conversión", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="Total" value={stats.total} />
          <StatChip label="Planes" value={stats.plan} />
          <StatChip label="Servicios" value={stats.service} />
          <StatChip label="Pendientes" value={stats.pending} tone="warning" />
          <StatChip label="Aceptadas" value={stats.accepted} tone="success" />
          <StatChip label="Rechazadas" value={stats.rejected} tone="error" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CreateProjectDialog />
        </div>
      </div>

      <Tabs value={kindFilter} onValueChange={(v) => setKindFilter(v as "all" | "plan" | "service")}>
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="plan">Planes</TabsTrigger>
          <TabsTrigger value="service">Servicios</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white shadow-[var(--shadow-card-dense)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cotización</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estimado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((quote) => (
              <TableRow key={quote.id} className="cursor-pointer" onClick={() => openDetail(quote)}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{quote.title}</p>
                    <p className="text-[11px] text-slate-500">{quote.code}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-700">{quote.clientName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {quote.intakeSource === "plan" ? "Plan" : "Servicio"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-700">
                  {formatCurrency(quote.estimate.build.min)}
                </TableCell>
                <TableCell>
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>
                <TableCell className="text-right text-xs text-slate-500">
                  {formatShortDate(quote.createdAt)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetail(quote)}>
                        <UserCheck className="size-4" />
                        Asignar PM y aceptar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => notifyStatus(quote, "rejected")} variant="destructive">
                        Rechazar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-slate-500">
                  No hay cotizaciones que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedQuote} onOpenChange={(o) => !o && setSelectedQuoteId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedQuote ? (
            <>
              <SheetHeader>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {selectedQuote.code}
                </p>
                <SheetTitle>{selectedQuote.title}</SheetTitle>
                <SheetDescription>
                  {selectedQuote.clientName} · {formatLongDate(selectedQuote.createdAt)}
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 px-4 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <Cell label="Origen" value={selectedQuote.intakeSource === "service" ? "Servicio" : "Plan"} />
                  <Cell label="Selección" value={selectedQuote.selectionLabel} />
                  <Cell label="Perfil" value={selectedQuote.planProfile === "business" ? "Empresarial" : "Personal"} />
                  <Cell
                    label="Estimado"
                    value={`${formatCurrency(selectedQuote.estimate.build.min)} – ${formatCurrency(selectedQuote.estimate.build.max)}`}
                  />
                </div>

                <div className="rounded-[12px] border border-slate-200 p-4">
                  <p className="kpi-label">Estado actual</p>
                  <div className="mt-2">
                    <QuoteStatusBadge status={selectedQuote.status} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asignar PM</Label>
                  <Select value={pmAssignment} onValueChange={setPmAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un PM" />
                    </SelectTrigger>
                    <SelectContent>
                      {pmUsers.map((pm) => {
                        const stats = getPmStats(state, pm.id);
                        return (
                          <SelectItem key={pm.id} value={pm.id}>
                            {pm.name} · {stats.activeProjects} activos
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => notifyStatus(selectedQuote, "rejected")}
                  className="border-error-500/40 text-error-700 hover:bg-error-50"
                >
                  <X className="size-4" />
                  Rechazar
                </Button>
                <Button className="btn-role" onClick={handleAccept} disabled={!pmAssignment}>
                  <CheckCircle2 className="size-4" />
                  Aceptar y crear proyecto
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: number;
  tone?: "neutral" | "success" | "warning" | "error";
}) {
  const toneCls =
    tone === "success"
      ? "bg-success-50 text-success-700"
      : tone === "warning"
        ? "bg-warning-50 text-warning-700"
        : tone === "error"
          ? "bg-error-50 text-error-700"
          : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium ${toneCls}`}>
      <span className="font-semibold">{value}</span>
      <span className="text-sm opacity-80">{label}</span>
    </span>
  );
}

function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const cls = {
    pending: "badge-status-warning",
    reviewed: "badge-status-info",
    accepted: "badge-status-success",
    rejected: "badge-status-error"
  }[status];
  return <span className={cls}>{getQuoteStatusLabel(status)}</span>;
}

function CreateProjectDialog() {
  const { state, createProjectDirect } = useDashboardWorkspace();
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    pmId: "",
    name: "",
    description: "",
    dueDate: "",
    budget: ""
  });

  async function handleSubmit() {
    if (!form.clientId || !form.name.trim() || !form.pmId) {
      toast.error("Faltan datos", { description: "Cliente, nombre del proyecto y PM son obligatorios." });
      return;
    }
    setSubmitting(true);
    try {
      const budgetNumber = form.budget.trim() ? Number(form.budget) : undefined;
      await createProjectDirect({
        clientId: form.clientId,
        pmId: form.pmId,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate || undefined,
        budget: Number.isFinite(budgetNumber) ? (budgetNumber as number) : undefined
      });
      toast.success("Proyecto creado", {
        description: "Se notificó al cliente y al PM asignado."
      });
      setOpen(false);
      setForm({ clientId: "", pmId: "", name: "", description: "", dueDate: "", budget: "" });
    } catch (error) {
      toast.error("No se pudo crear el proyecto", {
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
          Nuevo proyecto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear proyecto sin cotización previa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={form.clientId} onValueChange={(v) => setForm((c) => ({ ...c, clientId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Aún no hay clientes registrados.</div>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} · {client.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <TextField
            label="Nombre del proyecto"
            placeholder="Ej. Plataforma de reservas Acme"
            value={form.name}
            onChange={(v) => setForm((c) => ({ ...c, name: v }))}
          />
          <TextAreaField
            label="Descripción"
            placeholder="Resumen del alcance, contexto y entregables."
            rows={3}
            value={form.description}
            onChange={(v) => setForm((c) => ({ ...c, description: v }))}
          />
          <div className="space-y-2">
            <Label>Asignar PM</Label>
            <Select value={form.pmId} onValueChange={(v) => setForm((c) => ({ ...c, pmId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un PM" />
              </SelectTrigger>
              <SelectContent>
                {pms.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-500">Aún no hay PMs registrados.</div>
                ) : (
                  pms.map((pm) => {
                    const pmStats = getPmStats(state, pm.id);
                    return (
                      <SelectItem key={pm.id} value={pm.id}>
                        {pm.name} · {pmStats.activeProjects} activos
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Fecha de entrega</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((c) => ({ ...c, dueDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Presupuesto (MXN)</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.budget}
                onChange={(e) => setForm((c) => ({ ...c, budget: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button className="btn-role" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creando…" : "Crear proyecto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
