"use client";

import { useMemo, useState } from "react";

import { TextAreaField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardEmptyState, DashboardMutedCard, SectionHeading } from "@/features/dashboard/components/dashboard-ui";
import { getProjectPmEmail, getProjectClientEmail } from "@/features/dashboard/lib/recipients";
import { getPrimaryUser, getProjectMessages, getSelectedProject, getUserById } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/client-api";
import type { Role } from "@/lib/types/domain";

interface ProjectChatPanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProjectChatPanel({ role }: ProjectChatPanelProps) {
  const { state, addProjectMessage } = useDashboardWorkspace();
  const currentUser = getPrimaryUser(state, role);
  const project = getSelectedProject(state, role);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const orderedMessages = useMemo(() => getProjectMessages(state, project?.id), [project?.id, state]);
  const counterpart = getUserById(state, role === "client" ? project?.pmId : project?.clientId);

  if (!project) {
    return (
      <DashboardCard>
        <DashboardEmptyState title="Selecciona un proyecto" body="El chat se abre con el hilo del proyecto activo que elijas en la vista de proyectos." />
      </DashboardCard>
    );
  }

  const activeProject = project;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || !currentUser) {
      return;
    }

    const nextMessage = draft.trim();
    addProjectMessage(activeProject.id, currentUser.id, role, nextMessage);
    setDraft("");

    try {
      const recipientEmail = role === "client" ? getProjectPmEmail(state, activeProject.id) : getProjectClientEmail(state, activeProject.id);

      if (!recipientEmail || !counterpart) {
        throw new Error("No encontramos el correo de la contraparte para notificar.");
      }

      await sendDashboardNotification({
        type: "project_message",
        recipientEmail,
        recipientName: counterpart.name,
        projectName: activeProject.name,
        senderName: currentUser.name,
        senderRole: role,
        message: nextMessage
      });

      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos enviar el correo del mensaje.");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <DashboardMutedCard className="h-fit xl:sticky xl:top-4">
        <SectionHeading title="Hilo activo" />
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
            <p className="font-semibold text-slate-950">{activeProject.name}</p>
            <p className="mt-1">{role === "client" ? counterpart?.name ?? "PM sin asignar" : activeProject.clientName}</p>
          </div>
          <p className="leading-6">Este hilo es compartido por cliente y PM para el proyecto seleccionado.</p>
        </div>
      </DashboardMutedCard>

      <DashboardCard className="flex min-h-[65vh] flex-col">
        <SectionHeading title="Conversacion" description={counterpart ? `Hablando con ${counterpart.name}` : undefined} />

        <div className="custom-scrollbar mt-4 flex-1 overflow-y-auto rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3">
          <div className="space-y-2.5">
            {orderedMessages.length > 0 ? (
              orderedMessages.map((message) => {
                const isOwn = message.senderId === currentUser?.id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-[16px] px-3 py-2.5 ${isOwn ? "bg-[#4f2f96] text-white" : "bg-white text-slate-800"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isOwn ? "text-white/70" : "text-slate-500"}`}>{message.senderName}</p>
                      <p className="mt-1.5 text-sm leading-5">{message.preview}</p>
                      <p className={`mt-1.5 text-[10px] ${isOwn ? "text-white/70" : "text-slate-400"}`}>{message.sentAt}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <DashboardEmptyState title="Sin mensajes todavía" body="Cuando escribas el primer mensaje, ambos dashboards veran este mismo hilo." />
            )}
          </div>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <TextAreaField label="Mensaje" placeholder="Escribe un mensaje claro." rows={3} value={draft} onChange={setDraft} />
          {notice ? <p className="text-sm font-medium text-rose-600">{notice}</p> : null}
          <button type="submit" className="dashboard-button-primary w-fit">
            Enviar
          </button>
        </form>
      </DashboardCard>
    </div>
  );
}
