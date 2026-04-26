"use client";

import { Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import { getProjectClientEmail, getProjectPmEmail } from "@/features/dashboard/lib/recipients";
import {
  getPrimaryUser,
  getProjectMessages,
  getSelectedOrPrimaryProject,
  getUserById,
  getVisibleProjects
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import type { Role } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

interface ProjectChatPanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProjectChatPanel({ role }: ProjectChatPanelProps) {
  const { state, addProjectMessage, selectProject } = useDashboardWorkspace();
  const currentUser = getPrimaryUser(state, role);
  const visibleProjects = getVisibleProjects(state, role);
  const project = getSelectedOrPrimaryProject(state, role);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => getProjectMessages(state, project?.id), [project?.id, state]);
  const counterpart = getUserById(state, role === "client" ? project?.pmId : project?.clientId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!project) {
    return (
      <DashboardEmptyState
        title="Selecciona un proyecto"
        body="El chat se abre con el hilo del proyecto activo."
      />
    );
  }

  async function handleSend() {
    if (!draft.trim() || !currentUser || !project) return;

    setSending(true);
    const messageText = draft.trim();
    try {
      await addProjectMessage(project.id, currentUser.id, role, messageText);
      setDraft("");

      const recipientEmail =
        role === "client"
          ? getProjectPmEmail(state, project.id)
          : getProjectClientEmail(state, project.id);

      if (recipientEmail && counterpart) {
        await sendDashboardNotification({
          type: "project_message",
          recipientEmail,
          recipientName: counterpart.name,
          projectName: project.name,
          senderName: currentUser.name,
          senderRole: role,
          message: messageText
        });
      }
    } catch (error) {
      toast.error("No pudimos enviar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      {/* Project switcher */}
      <aside className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Conversaciones
        </p>
        <div className="mt-3 space-y-1.5">
          {visibleProjects.map((item) => {
            const selected = item.id === project.id;
            const itemUnread = getProjectMessages(state, item.id).filter(
              (m) => m.status === "unread" && m.recipientId === currentUser?.id
            ).length;
            const initials = item.clientName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectProject(role, item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition",
                  selected
                    ? "border-[var(--role,#5e92c2)] bg-[var(--role-soft,#eff6fb)]"
                    : "border-transparent hover:bg-slate-50"
                )}
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                    {itemUnread > 0 ? (
                      <Badge variant="secondary" className="h-4 min-w-4 bg-error-50 px-1.5 text-[9px] text-error-700">
                        {itemUnread}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="truncate text-[11px] text-slate-500">{item.clientName}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Conversation */}
      <section className="flex flex-col rounded-[var(--radius-card)] border border-slate-200 bg-white shadow-[var(--shadow-card)] min-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-[var(--role-strong,#224a78)] text-sm font-semibold text-white">
                {(counterpart?.name ?? "??")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-950">{counterpart?.name ?? "Sin contacto"}</p>
              <p className="text-[11px] text-slate-500">{project.name} · {project.quoteCode}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="space-y-3 p-5">
            {messages.length === 0 ? (
              <div className="py-12">
                <DashboardEmptyState
                  title="Empieza la conversación"
                  body="Cuando envíes el primer mensaje aparecerá aquí y le llegará un correo a la otra parte."
                />
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === currentUser?.id;
                const initials = message.senderName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwn ? (
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-slate-200 text-[10px] font-semibold text-slate-700">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                    <div
                      className={cn(
                        "max-w-[78%] rounded-[16px] px-3.5 py-2.5 shadow-[var(--shadow-card-dense)]",
                        isOwn
                          ? "rounded-br-sm bg-[var(--role-strong,#224a78)] text-white"
                          : "rounded-bl-sm bg-slate-100 text-slate-900"
                      )}
                    >
                      <p
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.12em]",
                          isOwn ? "text-white/70" : "text-slate-500"
                        )}
                      >
                        {message.senderName}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-5">{message.preview}</p>
                      <p
                        className={cn(
                          "mt-1.5 text-[10px]",
                          isOwn ? "text-white/70" : "text-slate-400"
                        )}
                      >
                        {message.sentAt}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder={`Escribe un mensaje para ${counterpart?.name ?? "tu contraparte"}…`}
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="resize-none"
            />
            <Button className="btn-role" onClick={handleSend} disabled={sending || !draft.trim()}>
              <Send className="size-4" />
              {sending ? "…" : "Enviar"}
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">⌘ + ↵ para enviar rápido</p>
        </div>
      </section>
    </div>
  );
}
