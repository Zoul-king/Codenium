"use client";

import { AlertTriangle, Calendar, CheckCircle2, Circle, Clock, Loader2, MessageSquare, User } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getProjectMessages,
  getProjectMilestones,
  getSelectedProject,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { ProjectRecord, ProjectStatus } from "@/lib/types/domain";
import { formatShortDate, getProjectStatusLabel } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

const KANBAN_COLUMNS: { status: ProjectStatus; label: string; tone: string }[] = [
  { status: "discovery", label: "Definición", tone: "border-info-500/40 bg-info-50/40" },
  { status: "design", label: "Diseño", tone: "border-warning-500/40 bg-warning-50/40" },
  { status: "build", label: "Desarrollo", tone: "border-[var(--role,#68b8b2)]/50 bg-[var(--role-soft,#eafaf7)]" },
  { status: "qa", label: "QA", tone: "border-accent-500/40 bg-accent-500/5" },
  { status: "done", label: "Entregado", tone: "border-success-500/40 bg-success-50/40" }
];

export function PmOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const allProjects = getVisibleProjects(state, "pm");
  const selectedProject = getSelectedProject(state, "pm");

  const activeProjects = allProjects.filter((p) => p.status !== "done");
  const blockedProjects = allProjects.filter((p) => p.progress < 30 && p.status !== "done");

  const totalMilestones = allProjects.reduce(
    (acc, p) => acc + getProjectMilestones(state, p.id).length,
    0
  );
  const overdueMilestones = allProjects.reduce((acc, p) => {
    const ms = getProjectMilestones(state, p.id);
    const today = new Date("2026-04-09T12:00:00");
    return acc + ms.filter((m) => m.status !== "done" && new Date(`${m.date}T12:00:00`) < today).length;
  }, 0);

  return (
    <div className="space-y-6">
      {/* HEADER STATS */}
      <div className="grid gap-3 md:grid-cols-4">
        <OpsStatCard
          label="Proyectos activos"
          value={activeProjects.length}
          icon={<Loader2 className="size-4" />}
        />
        <OpsStatCard
          label="Bloqueados"
          value={blockedProjects.length}
          icon={<AlertTriangle className="size-4" />}
          tone={blockedProjects.length > 0 ? "warning" : "neutral"}
        />
        <OpsStatCard
          label="Hitos totales"
          value={totalMilestones}
          icon={<CheckCircle2 className="size-4" />}
        />
        <OpsStatCard
          label="Hitos atrasados"
          value={overdueMilestones}
          icon={<Clock className="size-4" />}
          tone={overdueMilestones > 0 ? "error" : "neutral"}
        />
      </div>

      <Tabs defaultValue="kanban">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList variant="line" className="bg-transparent">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="blocked">
              Bloqueados {blockedProjects.length > 0 ? `(${blockedProjects.length})` : ""}
            </TabsTrigger>
          </TabsList>

          {selectedProject ? (
            <Link href="/dashboard/pm/milestones">
              <Button variant="outline" className="btn-role-outline">
                Gestionar hitos →
              </Button>
            </Link>
          ) : null}
        </div>

        {/* KANBAN VIEW */}
        <TabsContent value="kanban" className="mt-6">
          {allProjects.length === 0 ? (
            <DashboardEmptyState
              title="No tienes proyectos asignados"
              body="Cuando admin te asigne uno, aparecerá aquí en su columna correspondiente."
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-5">
              {KANBAN_COLUMNS.map((col) => {
                const items = allProjects.filter((p) => p.status === col.status);

                return (
                  <div key={col.status} className={cn("rounded-[var(--radius-card-dense)] border-2 border-dashed p-3", col.tone)}>
                    <div className="mb-3 flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
                        {col.label}
                      </span>
                      <Badge variant="secondary" className="h-5 min-w-5 justify-center bg-white text-[10px] text-slate-700">
                        {items.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((project) => (
                        <KanbanCard
                          key={project.id}
                          project={project}
                          state={state}
                          isSelected={selectedProject?.id === project.id}
                          onSelect={() => selectProject("pm", project.id)}
                        />
                      ))}
                      {items.length === 0 ? (
                        <div className="rounded-[12px] border border-dashed border-slate-300 bg-white/50 px-3 py-6 text-center">
                          <span className="text-[11px] text-slate-400">Vacío</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* LIST VIEW */}
        <TabsContent value="list" className="mt-6">
          <div className="space-y-3">
            {allProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                state={state}
                isSelected={selectedProject?.id === project.id}
                onSelect={() => selectProject("pm", project.id)}
              />
            ))}
            {allProjects.length === 0 ? (
              <DashboardEmptyState
                title="Sin proyectos"
                body="Cuando se te asigne uno aparecerá aquí."
              />
            ) : null}
          </div>
        </TabsContent>

        {/* BLOCKED VIEW */}
        <TabsContent value="blocked" className="mt-6">
          {blockedProjects.length > 0 ? (
            <div className="space-y-3">
              {blockedProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  state={state}
                  isSelected={selectedProject?.id === project.id}
                  onSelect={() => selectProject("pm", project.id)}
                  warning
                />
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="Sin proyectos bloqueados"
              body="Buen trabajo. Todo avanza por encima del umbral de atención."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OpsStatCard({
  label,
  value,
  icon,
  tone = "neutral"
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "neutral" | "warning" | "error";
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="kpi-label">{label}</span>
        <span
          className={cn(
            "grid size-7 place-items-center rounded-full",
            tone === "warning"
              ? "bg-warning-50 text-warning-700"
              : tone === "error"
                ? "bg-error-50 text-error-700"
                : "bg-slate-100 text-slate-600"
          )}
        >
          {icon}
        </span>
      </div>
      <p className="kpi-value mt-3">{value}</p>
    </div>
  );
}

function KanbanCard({
  project,
  state,
  isSelected,
  onSelect
}: {
  project: ProjectRecord;
  state: ReturnType<typeof useDashboardWorkspace>["state"];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const messages = getProjectMessages(state, project.id);
  const unreadCount = messages.filter(
    (m) => m.status === "unread" && m.recipientId === project.pmId
  ).length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "ops-card block w-full text-left",
        isSelected && "border-[var(--role-strong,#4f9792)] ring-1 ring-[var(--role,#68b8b2)]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-tight text-slate-950">{project.name}</h3>
        {unreadCount > 0 ? (
          <Badge variant="secondary" className="h-5 bg-error-50 px-1.5 text-[10px] text-error-700">
            {unreadCount}
          </Badge>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
        <User className="size-3" />
        {project.clientName}
      </div>
      <div className="mt-3 h-1 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[var(--role-strong,#4f9792)] transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>{project.progress}%</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-2.5" />
          {formatShortDate(project.dueDate)}
        </span>
      </div>
    </button>
  );
}

function ProjectListItem({
  project,
  state,
  isSelected,
  onSelect,
  warning
}: {
  project: ProjectRecord;
  state: ReturnType<typeof useDashboardWorkspace>["state"];
  isSelected: boolean;
  onSelect: () => void;
  warning?: boolean;
}) {
  const messages = getProjectMessages(state, project.id);
  const unreadCount = messages.filter(
    (m) => m.status === "unread" && m.recipientId === project.pmId
  ).length;
  const milestones = getProjectMilestones(state, project.id);
  const completedMilestones = milestones.filter((m) => m.status === "done").length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "block w-full rounded-[var(--radius-card-dense)] border bg-white p-4 text-left transition shadow-[var(--shadow-card-dense)]",
        isSelected
          ? "border-[var(--role-strong,#4f9792)] ring-1 ring-[var(--role,#68b8b2)]"
          : warning
            ? "border-warning-500/40 hover:border-warning-500"
            : "border-slate-200 hover:border-[var(--role,#68b8b2)]/50"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950">{project.name}</h3>
            <Badge variant="outline" className="h-5 text-[10px] uppercase tracking-wide">
              {getProjectStatusLabel(project.status)}
            </Badge>
            {warning ? (
              <span className="badge-status-warning">
                <AlertTriangle className="size-3" />
                Atención
              </span>
            ) : null}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {project.clientName}
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              {completedMilestones}/{milestones.length} hitos
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {formatShortDate(project.dueDate)}
            </span>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold text-error-600">
                <MessageSquare className="size-3" />
                {unreadCount} sin leer
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-[-0.04em] text-slate-950">{project.progress}%</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">avance</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            warning ? "bg-warning-500" : "bg-[var(--role-strong,#4f9792)]"
          )}
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </button>
  );
}

void Circle;
