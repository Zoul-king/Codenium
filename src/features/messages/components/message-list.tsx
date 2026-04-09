import { mockMessages } from "@/lib/mocks";
import type { Role } from "@/lib/types/domain";

interface MessageListProps {
  role: Role;
}

export function MessageList({ role }: MessageListProps) {
  const items = role === "admin" ? mockMessages : mockMessages.filter((item) => item.role === role || item.role === "admin");

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((message) => (
        <article key={message.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-body-color">{message.thread}</h3>
              <p className="mt-2 text-sm font-semibold text-primary-500">{message.senderName}</p>
              <p className="type-body mt-3">{message.preview}</p>
            </div>
            <div className="text-right">
              <span className="tag">{message.status}</span>
              <p className="mt-3 text-sm text-body-color">{message.sentAt}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
