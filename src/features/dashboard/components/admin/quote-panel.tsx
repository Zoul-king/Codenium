"use client";

import { CheckCircle2, Filter, MoreHorizontal, Search, UserCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
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
  { value: "reviewed", label: "Revisadas" },
  { value: "accepted", label: "Aceptadas" },
  { value: "rejected", label: "Rechazadas" }
];

export function AdminQuotePanel() {
  const { state, acceptQuote, setQuoteStatus } = useDashboardWorkspace();
  const pmUsers = getPmUsers(state);
  const quotes = getVisibleQuotes(state, "admin");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [pmAssignment, setPmAssignment] = useState("");

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (search && ![q.title, q.code, q.clientName].some((s) => s.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [quotes, search, statusFilter]);

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
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#3f237a)]">
              Pipeline comercial
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">Cotizaciones</h1>
            <p className="mt-1 text-sm text-slate-600">{quotes.length} en total · administra estado y asignación de PM</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[200px] pl-9"
              />
            </div>
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
          </div>
        </div>
      </header>

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
                    {quote.quoteKind === "prequote" ? "Pre" : "Formal"}
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
                      <DropdownMenuItem onClick={() => notifyStatus(quote, "reviewed")}>
                        Marcar revisada
                      </DropdownMenuItem>
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
                <Button variant="outline" onClick={() => notifyStatus(selectedQuote, "reviewed")}>
                  Marcar revisada
                </Button>
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

function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const cls = {
    pending: "badge-status-warning",
    reviewed: "badge-status-info",
    accepted: "badge-status-success",
    rejected: "badge-status-error"
  }[status];
  return <span className={cls}>{getQuoteStatusLabel(status)}</span>;
}
