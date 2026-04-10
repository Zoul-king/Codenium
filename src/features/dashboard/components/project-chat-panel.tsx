"use client";

import { useMemo, useState } from "react";

import { TextAreaField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getPrimaryUser, getProjectMessages, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { ProjectRecord, Role } from "@/lib/types/domain";

interface ProjectChatPanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProjectChatPanel({ role }: ProjectChatPanelProps) {
  const { state, addProjectMessage } = useDashboardWorkspace();
  const availableProjects: ProjectRecord[] =
    role === "client"
      ? (() => {
          const project = getPrimaryProject(state, "client");
          return project ? [project] : [];
        })()
      : getVisibleProjects(state, "pm");
  const [activeProjectId, setActiveProjectId] = useState(availableProjects[0]?.id ?? "");
  const activeProject = availableProjects.find((project) => project.id === activeProjectId) ?? availableProjects[0];
  const currentUser = getPrimaryUser(state, role);
  const [draft, setDraft] = useState("");
  const orderedMessages = useMemo(() => getProjectMessages(state, activeProject?.id).slice().reverse(), [state, activeProject?.id]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || !currentUser || !activeProject) {
      return;
    }

    addProjectMessage(activeProject.id, currentUser.id, role, draft.trim());
    setDraft("");
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <DashboardMutedCard>
        <SectionHeading eyebrow="Conversaciones" title={role === "client" ? "Tu proyecto activo" : "Proyectos asignados"} />
        <div className="mt-6 grid gap-3">
          {availableProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveProjectId(project.id)}
              className={`rounded-[20px] border p-4 text-left transition ${
                project.id === activeProject?.id ? "border-primary-200 bg-primary-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{project.name}</p>
                <StatusBadge tone={project.id === activeProject?.id ? "accent" : "neutral"}>{project.id === activeProject?.id ? "Activo" : "Abrir"}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{project.summary}</p>
            </button>
          ))}
        </div>
      </DashboardMutedCard>

      <DashboardCard>
        <div className="flex h-full flex-col">
          <SectionHeading eyebrow="Chat" title={activeProject?.name ?? "Sin proyecto"} description="Cliente y PM leen la misma conversacion del proyecto dentro de la sesion actual." />
          <div className="mt-6 flex-1 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            {orderedMessages.map((message) => {
              const isOwn = message.senderId === currentUser?.id;

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-[18px] px-4 py-3 ${isOwn ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${isOwn ? "text-white/65" : "text-slate-500"}`}>{message.senderName}</p>
                    <p className="mt-2 text-sm leading-6">{message.preview}</p>
                    <p className={`mt-2 text-xs ${isOwn ? "text-white/60" : "text-slate-400"}`}>{message.sentAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="mt-5" onSubmit={handleSubmit}>
            <TextAreaField label="Responder" placeholder="Escribe un mensaje claro y accionable" rows={4} value={draft} onChange={setDraft} />
            <button type="submit" className="dashboard-button-primary mt-4">
              Enviar mensaje
            </button>
          </form>
        </div>
      </DashboardCard>
    </div>
  );
}
