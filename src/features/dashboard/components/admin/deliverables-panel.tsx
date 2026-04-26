"use client";

import { ExternalLink, FileText, Filter, LayoutTemplate, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import { getProjectById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatShortDate } from "@/lib/utils/presenters";

export function AdminDeliverablesPanel() {
  const { state } = useDashboardWorkspace();
  const allDocs = state.documents;
  const templates = allDocs.filter((d) => d.template);
  const shared = allDocs.filter((d) => d.audience === "client" || d.audience === "shared");

  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState("all");

  const kinds = useMemo(() => Array.from(new Set(allDocs.map((d) => d.kind))), [allDocs]);

  function applyFilters(items: typeof allDocs) {
    return items.filter((doc) => {
      if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (kindFilter !== "all" && doc.kind !== kindFilter) return false;
      return true;
    });
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#3f237a)]">
              Biblioteca
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">Entregables</h1>
            <p className="mt-1 text-sm text-slate-600">
              {allDocs.length} documentos · {templates.length} plantillas · {shared.length} compartidos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {kinds.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="all">
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="all">Todos ({allDocs.length})</TabsTrigger>
          <TabsTrigger value="templates">Plantillas ({templates.length})</TabsTrigger>
          <TabsTrigger value="shared">Compartidos ({shared.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DocumentsGrid docs={applyFilters(allDocs)} state={state} />
        </TabsContent>
        <TabsContent value="templates" className="mt-6">
          <DocumentsGrid docs={applyFilters(templates)} state={state} showTemplate />
        </TabsContent>
        <TabsContent value="shared" className="mt-6">
          <DocumentsGrid docs={applyFilters(shared)} state={state} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentsGrid({
  docs,
  state,
  showTemplate
}: {
  docs: ReturnType<typeof useDashboardWorkspace>["state"]["documents"];
  state: ReturnType<typeof useDashboardWorkspace>["state"];
  showTemplate?: boolean;
}) {
  if (docs.length === 0) {
    return <DashboardEmptyState title="Sin documentos" body="Ajusta los filtros o registra entregables desde los paneles de proyecto." />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {docs.map((doc) => {
        const project = getProjectById(state, doc.projectId);
        return (
          <a
            key={doc.id}
            href={doc.href}
            className="group rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card-dense)] transition hover:border-[var(--role,#5e92c2)]/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-10 place-items-center rounded-[12px] bg-[var(--role-soft,#efe9fb)] text-[var(--role-strong,#3f237a)]">
                {showTemplate || doc.template ? <LayoutTemplate className="size-5" /> : <FileText className="size-5" />}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {doc.template ? (
                  <Badge variant="secondary" className="bg-info-50 text-[10px] uppercase text-info-700">
                    Plantilla
                  </Badge>
                ) : null}
                <Badge variant="outline" className="text-[10px] uppercase">
                  {doc.kind}
                </Badge>
              </div>
            </div>
            <p className="mt-4 text-base font-semibold leading-tight text-slate-950">{doc.title}</p>
            {project ? (
              <p className="mt-1 truncate text-xs text-slate-500">{project.name}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">Sin proyecto asociado</p>
            )}
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500">{formatShortDate(doc.updatedAt)}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--role-strong,#3f237a)] group-hover:underline">
                Abrir <ExternalLink className="size-3" />
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
