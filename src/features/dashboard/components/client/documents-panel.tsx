"use client";

import { ExternalLink, FileText, Filter, Plus, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextField } from "@/components/common/form-field";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import { getProjectClientEmail } from "@/features/dashboard/lib/recipients";
import { getProjectDocuments, getSelectedOrPrimaryProject } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import type { Role } from "@/lib/types/domain";
import { formatLongDate, formatShortDate } from "@/lib/utils/presenters";

interface ClientDocumentsPanelProps {
  role?: Extract<Role, "client" | "pm">;
}

export function ClientDocumentsPanel({ role = "client" }: ClientDocumentsPanelProps) {
  const { state } = useDashboardWorkspace();
  const project = getSelectedOrPrimaryProject(state, role);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState("all");

  const documents = useMemo(() => {
    if (!project) return [];
    const all = getProjectDocuments(state, project.id).filter((doc) =>
      role === "client" ? doc.audience !== "pm" && doc.audience !== "admin" : doc.audience !== "admin"
    );

    return all.filter((doc) => {
      if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (kindFilter !== "all" && doc.kind !== kindFilter) return false;
      return true;
    });
  }, [project, role, state, search, kindFilter]);

  const kinds = useMemo(() => {
    if (!project) return [];
    return Array.from(new Set(getProjectDocuments(state, project.id).map((d) => d.kind)));
  }, [project, state]);

  if (!project) {
    return (
      <DashboardEmptyState
        title="Selecciona un proyecto"
        body="Los entregables visibles dependen del proyecto activo que elijas."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className={role === "client" ? "warm-card" : "rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]"}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#224a78)]">
              Entregables
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">{project.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {documents.length} {documents.length === 1 ? "documento" : "documentos"} disponibles · proyecto {project.clientName}
            </p>
          </div>
          {role === "pm" ? <RegisterDocumentDialog project={project} /> : null}
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-3 shadow-[var(--shadow-card-dense)]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <Select value={kindFilter} onValueChange={setKindFilter}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {kinds.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documents grid */}
      {documents.length === 0 ? (
        <DashboardEmptyState
          title="No hay documentos que coincidan"
          body={search || kindFilter !== "all" ? "Ajusta los filtros para verlos." : "Cuando se registren entregables, aparecerán aquí."}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.href}
              className="group rounded-[var(--radius-card-dense)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card-dense)] transition hover:border-[var(--role,#5e92c2)]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 place-items-center rounded-[12px] bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]">
                  <FileText className="size-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  {doc.kind}
                </span>
              </div>
              <p className="mt-4 text-base font-semibold leading-tight text-slate-950">{doc.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                Actualizado el {formatLongDate(doc.updatedAt)}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500">{formatShortDate(doc.updatedAt)}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--role-strong,#224a78)] group-hover:underline">
                  Abrir
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function RegisterDocumentDialog({
  project
}: {
  project: { id: string; name: string; clientName: string; pmId: string };
}) {
  const { state, addProjectDocument } = useDashboardWorkspace();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("PDF");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !fileName) {
      toast.error("Faltan datos", { description: "Necesitamos título y archivo." });
      return;
    }

    setSubmitting(true);
    addProjectDocument({
      projectId: project.id,
      title: title.trim(),
      kind,
      href: `#${fileName.toLowerCase().replace(/\s+/g, "-")}`,
      audience: "client"
    });

    try {
      const recipientEmail = getProjectClientEmail(state, project.id);
      if (recipientEmail) {
        await sendDashboardNotification({
          type: "deliverable_notification",
          recipientEmail,
          recipientName: project.clientName,
          projectName: project.name,
          title: title.trim(),
          kind,
          fileName,
          registeredBy: state.users.find((u) => u.id === project.pmId)?.name ?? "PM asignado"
        });
      }
      toast.success("Entregable registrado", { description: "El cliente recibirá una notificación." });
      setOpen(false);
      setTitle("");
      setFileName("");
      setKind("PDF");
    } catch (error) {
      toast.warning("Quedó registrado pero no enviamos email", {
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
          Registrar entregable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo entregable</DialogTitle>
          <DialogDescription>El cliente recibirá una notificación con el detalle.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <TextField label="Nombre del entregable" placeholder="Ej. Sprint 2 validado" value={title} onChange={setTitle} />
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Doc">Documento</SelectItem>
                <SelectItem value="Figma">Figma</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Archivo</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-[var(--role,#5e92c2)]">
              <Upload className="size-5 text-slate-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700">{fileName || "Selecciona un archivo"}</p>
                <p className="text-xs text-slate-500">PDF, Doc, Figma o cualquier link</p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button className="btn-role" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Registrando…" : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
