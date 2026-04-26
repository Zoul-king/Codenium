"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getLatestMilestone,
  getProjectMilestones,
  getProjectMessages,
  getProjectPayments,
  getSelectedOrPrimaryProject,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { formatLongDate, formatShortDate, getProjectStatusLabel } from "@/lib/utils/presenters";
import { cn } from "@/lib/utils";

export function ClientOverviewPanel() {
  const { state, selectProject } = useDashboardWorkspace();
  const projects = getVisibleProjects(state, "client");
  const activeProjects = projects.filter((project) => project.status !== "done");
  const selectedProject = getSelectedOrPrimaryProject(state, "client");

  if (!selectedProject) {
    return (
      <DashboardEmptyState
        title="Aún no tienes proyectos activos"
        body="En cuanto aceptemos una de tus cotizaciones se mostrará aquí con todo el detalle de avance."
      />
    );
  }

  const milestones = getProjectMilestones(state, selectedProject.id).slice().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const currentMilestone = milestones.find((m) => m.status === "current");
  const nextMilestone = milestones.find((m) => m.status === "next");
  const focusMilestone = currentMilestone ?? nextMilestone ?? getLatestMilestone(state, selectedProject.id);

  const payments = getProjectPayments(state, selectedProject.id);
  const nextPayment = payments
    .filter((p) => p.status !== "paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const messages = getProjectMessages(state, selectedProject.id);
  const unreadCount = messages.filter((m) => m.status === "unread" && m.senderId !== "user-client-1").length;
  const completedCount = milestones.filter((m) => m.status === "done").length;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="warm-card relative overflow-hidden">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[var(--role,#5e92c2)]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-[var(--color-secondary-500)]/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-status-info">
                <Sparkles className="size-3" />
                {getProjectStatusLabel(selectedProject.status)}
              </span>
              {currentMilestone ? (
                <span className="badge-status-neutral">Fase actual: {currentMilestone.title}</span>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--role-strong,#224a78)]">
                Tu proyecto
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-950 lg:text-4xl">
                {selectedProject.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                {selectedProject.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 text-[var(--role-strong,#224a78)]" />
                Entrega: {formatLongDate(selectedProject.dueDate)}
              </span>
              <span className="text-slate-300">•</span>
              <span>
                {completedCount} de {milestones.length} hitos completados
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard/client/milestones">
                <Button className="btn-role">
                  Ver hito actual
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard/client/chat">
                <Button variant="outline" className="btn-role-outline">
                  <MessageCircle className="size-4" />
                  Hablar con tu PM
                </Button>
              </Link>
            </div>
          </div>

          <ProgressRing value={selectedProject.progress} />
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* TIMELINE DE HITOS */}
        <section className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Avance
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-950">
                Hitos de tu proyecto
              </h2>
            </div>
            <Link
              href="/dashboard/client/milestones"
              className="text-xs font-semibold text-[var(--role-strong,#224a78)] hover:underline"
            >
              Ver todos →
            </Link>
          </div>

          {milestones.length > 0 ? (
            <ol className="mt-6 space-y-1">
              {milestones.map((milestone, idx) => {
                const isLast = idx === milestones.length - 1;
                const isFocus = milestone.id === focusMilestone?.id;

                return (
                  <li key={milestone.id} className="relative pl-8">
                    {!isLast ? (
                      <span className="absolute left-[11px] top-6 h-full w-px bg-slate-200" />
                    ) : null}
                    <span
                      className={cn(
                        "absolute left-0 top-1.5 grid size-6 place-items-center rounded-full border-2",
                        milestone.status === "done"
                          ? "border-success-500 bg-success-50 text-success-600"
                          : milestone.status === "current"
                            ? "border-[var(--role-strong,#224a78)] bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]"
                            : "border-slate-300 bg-white text-slate-400"
                      )}
                    >
                      {milestone.status === "done" ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <div
                      className={cn(
                        "rounded-[14px] px-4 py-3 transition",
                        isFocus
                          ? "bg-[var(--role-soft,#eff6fb)] ring-1 ring-[var(--role,#5e92c2)]/30"
                          : "hover:bg-slate-50"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-950">{milestone.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            {milestone.summary}
                          </p>
                        </div>
                        <span className="whitespace-nowrap text-[11px] font-medium text-slate-500">
                          {formatShortDate(milestone.date)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              Aún no se han definido hitos. Tu PM te contactará con el plan inicial.
            </p>
          )}
        </section>

        {/* STATS WARM */}
        <aside className="space-y-4">
          <WarmStatCard
            label="Próxima entrega"
            value={focusMilestone?.title ?? "Por definir"}
            helper={focusMilestone ? formatLongDate(focusMilestone.date) : "Tu PM lo agendará"}
            icon={<Calendar className="size-4" />}
          />
          <WarmStatCard
            label="Próximo pago"
            value={nextPayment ? `$${nextPayment.amount.toLocaleString("es-MX")}` : "Sin pagos"}
            helper={nextPayment ? `Vence ${formatShortDate(nextPayment.dueDate)}` : "Estás al día"}
            icon={<Calendar className="size-4" />}
            href="/dashboard/client/payments"
          />
          <WarmStatCard
            label="Mensajes"
            value={unreadCount > 0 ? `${unreadCount} sin leer` : "Al día"}
            helper={
              unreadCount > 0
                ? "Tu PM tiene novedades"
                : `${messages.length} mensajes en total`
            }
            icon={<MessageCircle className="size-4" />}
            href="/dashboard/client/chat"
            highlight={unreadCount > 0}
          />

          {activeProjects.length > 1 ? (
            <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Otros proyectos
              </p>
              <div className="mt-3 space-y-2">
                {activeProjects
                  .filter((p) => p.id !== selectedProject.id)
                  .map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => selectProject("client", project.id)}
                      className="block w-full rounded-[12px] border border-slate-200 px-3 py-2.5 text-left text-sm transition hover:border-[var(--role,#5e92c2)]/40 hover:bg-slate-50"
                    >
                      <p className="font-semibold text-slate-950">{project.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {project.progress}% · {getProjectStatusLabel(project.status)}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="relative grid size-44 place-items-center">
      <svg className="size-44 -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} className="fill-none stroke-slate-200" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="fill-none stroke-[var(--role-strong,#224a78)] transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Avance
        </span>
        <span className="text-4xl font-bold tracking-[-0.04em] text-slate-950">{safe}%</span>
      </div>
    </div>
  );
}

interface WarmStatCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  href?: string;
  highlight?: boolean;
}

function WarmStatCard({ label, value, helper, icon, href, highlight }: WarmStatCardProps) {
  const inner = (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-white p-5 shadow-[var(--shadow-card)] transition",
        highlight
          ? "border-[var(--role,#5e92c2)]/40 ring-1 ring-[var(--role,#5e92c2)]/20"
          : "border-slate-200",
        href && "hover:border-[var(--role,#5e92c2)]/40"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]">
          {icon}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
}
