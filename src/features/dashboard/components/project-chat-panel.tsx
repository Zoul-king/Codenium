"use client";

import { useEffect, useMemo, useState } from "react";

import { TextAreaField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getPrimaryUser, getProjectMessages, getUserById, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { ProjectRecord, Role } from "@/lib/types/domain";

interface ProjectChatPanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProjectChatPanel({ role }: ProjectChatPanelProps) {
  const { state, addProjectMessage } = useDashboardWorkspace();
  const currentUser = getPrimaryUser(state, role);
  const clientProject = getPrimaryProject(state, "client");
  const pmProjects = getVisibleProjects(state, "pm");

  const clientOptions = useMemo(() => {
    if (role !== "pm") {
      return [];
    }

    const seen = new Set<string>();

    return pmProjects
      .map((project) => getUserById(state, project.clientId))
      .filter((user): user is NonNullable<typeof user> => Boolean(user))
      .filter((user) => {
        if (seen.has(user.id)) {
          return false;
        }

        seen.add(user.id);
        return true;
      });
  }, [pmProjects, role, state]);

  const [selectedClientId, setSelectedClientId] = useState(clientOptions[0]?.id ?? "");
  const pmProjectOptions = useMemo(
    () => pmProjects.filter((project) => (selectedClientId ? project.clientId === selectedClientId : true)),
    [pmProjects, selectedClientId]
  );
  const [activeProjectId, setActiveProjectId] = useState(role === "client" ? clientProject?.id ?? "" : pmProjectOptions[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (role === "pm" && clientOptions.length > 0 && !selectedClientId) {
      setSelectedClientId(clientOptions[0].id);
    }
  }, [clientOptions, role, selectedClientId]);

  useEffect(() => {
    if (role === "client") {
      setActiveProjectId(clientProject?.id ?? "");
      return;
    }

    if (pmProjectOptions.length > 0 && !pmProjectOptions.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(pmProjectOptions[0].id);
    }
  }, [activeProjectId, clientProject?.id, pmProjectOptions, role]);

  const activeProject =
    role === "client"
      ? clientProject
      : pmProjectOptions.find((project) => project.id === activeProjectId) ?? pmProjectOptions[0];
  const orderedMessages = useMemo(() => getProjectMessages(state, activeProject?.id), [activeProject?.id, state]);
  const counterpart = getUserById(state, role === "client" ? activeProject?.pmId : activeProject?.clientId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || !currentUser || !activeProject) {
      return;
    }

    addProjectMessage(activeProject.id, currentUser.id, role, draft.trim());
    setDraft("");
  }

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      {role === "pm" ? (
        <DashboardMutedCard className="flex min-h-0 flex-col">
          <div className="border-b border-slate-200 pb-5">
            <p className="dashboard-eyebrow">Chat con cliente</p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-slate-950">Selecciona el hilo</h2>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Usuario
              <select value={selectedClientId} onChange={(event) => setSelectedClientId(event.target.value)} className="dashboard-select">
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-2">
              <p className="text-sm font-medium text-slate-700">Proyecto</p>
              {pmProjectOptions.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                  className={`rounded-[16px] border px-4 py-4 text-left transition ${
                    project.id === activeProject?.id ? "border-primary-200 bg-primary-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="font-semibold text-slate-950">{project.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </DashboardMutedCard>
      ) : null}

      <DashboardCard className="flex min-h-0 flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-950">{activeProject?.name ?? "Sin proyecto seleccionado"}</h2>
            <p className="mt-2 text-sm text-slate-600">{counterpart ? counterpart.name : "Sin contraparte visible"} </p>
          </div>
          {activeProject ? <StatusBadge tone="accent">{role === "client" ? "PM asignado" : "Cliente activo"}</StatusBadge> : null}
        </div>

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-3">
            {orderedMessages.map((message) => {
              const isOwn = message.senderId === currentUser?.id;

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-[18px] px-4 py-3 ${isOwn ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${isOwn ? "text-white/60" : "text-slate-500"}`}>{message.senderName}</p>
                    <p className="mt-2 text-sm leading-6">{message.preview}</p>
                    <p className={`mt-2 text-xs ${isOwn ? "text-white/55" : "text-slate-400"}`}>{message.sentAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form className="mt-5 border-t border-slate-200 pt-5" onSubmit={handleSubmit}>
          <TextAreaField label="Mensaje" placeholder="Escribe un mensaje claro y accionable." rows={4} value={draft} onChange={setDraft} />
          <button type="submit" className="dashboard-button-primary mt-4">
            Enviar mensaje
          </button>
        </form>
      </DashboardCard>
    </div>
  );
}
