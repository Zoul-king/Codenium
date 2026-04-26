"use client";

import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { getVisibleMessages } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { Role } from "@/lib/types/domain";

interface MessageListProps {
  role: Role;
}

export function MessageList({ role }: MessageListProps) {
  const { state } = useDashboardWorkspace();
  const items = getVisibleMessages(state, role);

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[0.84fr_1.16fr]">
      <DashboardMutedCard>
        <SectionHeading eyebrow="Mensajes" title="Pendientes con contexto de proyecto" description="Se eliminan las tarjetas genericas; cada mensaje conserva hilo, remitente y estado." />
      </DashboardMutedCard>

      <DashboardCard>
        <div className="flex h-full flex-col">
          <SectionHeading eyebrow="Bandeja" title={role === "pm" ? "Conversaciones asignadas" : "Mensajes visibles"} />
          <div className="mt-6 flex-1 space-y-4">
            {items.map((message) => (
              <div key={message.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{message.thread}</p>
                    <p className="mt-1 text-sm text-slate-500">{message.senderName}</p>
                  </div>
                  <StatusBadge tone={message.status === "unread" ? "warning" : "neutral"}>{message.status === "unread" ? "Pendiente" : "Leido"}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{message.preview}</p>
                <p className="mt-3 text-sm font-medium text-slate-500">{message.sentAt}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
