"use client";

import { useEffect, useMemo, useState } from "react";

import { TextAreaField } from "@/components/ui/form-controls";
import { DashboardCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getPrimaryProject, getPrimaryUser, getProjectMessages, getUserById, getVisibleProjects } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { Role } from "@/lib/types/domain";

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
  const projectOptions = useMemo(
    () => pmProjects.filter((project) => (selectedClientId ? project.clientId === selectedClientId : true)),
    [pmProjects, selectedClientId]
  );
  const [activeProjectId, setActiveProjectId] = useState(role === "client" ? clientProject?.id ?? "" : projectOptions[0]?.id ?? "");
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

    if (projectOptions.length > 0 && !projectOptions.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(projectOptions[0].id);
    }
  }, [activeProjectId, clientProject?.id, projectOptions, role]);

  const activeProject = role === "client" ? clientProject : projectOptions.find((project) => project.id === activeProjectId) ?? projectOptions[0];
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
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      {role === "pm" ? (
        <DashboardCard className="h-fit xl:sticky xl:top-6">
          <SectionHeading eyebrow="Chat con clientes" title="Selecciona el hilo" />

          <div className="mt-6 grid gap-5">
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
              {projectOptions.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                  className={`border-b px-0 py-3 text-left transition ${
                    project.id === activeProject?.id ? "border-slate-950 text-slate-950" : "border-slate-200 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <p className="font-semibold">{project.name}</p>
                  <p className="mt-1 text-sm leading-6">{project.clientName}</p>
                </button>
              ))}
            </div>
          </div>
        </DashboardCard>
      ) : null}

      <DashboardCard className="flex min-h-0 flex-col">
        <SectionHeading eyebrow="Conversacion" title={activeProject?.name ?? "Sin proyecto seleccionado"} description={counterpart ? counterpart.name : undefined} />

        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto border-y border-slate-200 py-5">
          <div className="space-y-4">
            {orderedMessages.map((message) => {
              const isOwn = message.senderId === currentUser?.id;

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-[18px] px-4 py-3 ${isOwn ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${isOwn ? "text-white/60" : "text-slate-500"}`}>{message.senderName}</p>
                    <p className="mt-2 text-sm leading-6">{message.preview}</p>
                    <p className={`mt-2 text-xs ${isOwn ? "text-white/55" : "text-slate-400"}`}>{message.sentAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form className="mt-5" onSubmit={handleSubmit}>
          <TextAreaField label="Mensaje" placeholder="Escribe un mensaje claro y accionable." rows={4} value={draft} onChange={setDraft} />
          <button type="submit" className="dashboard-button-primary mt-4">
            Enviar mensaje
          </button>
        </form>
      </DashboardCard>
    </div>
  );
}
