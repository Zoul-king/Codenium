import { mockMessages, mockProjects, mockQuotes, mockUsers } from "@/lib/mocks";
import type { MessageRecord, ProjectRecord, QuoteRecord, Role, UserRecord } from "@/lib/types/domain";

const primaryUserByRole: Record<Role, string> = {
  client: "user-client-1",
  pm: "user-pm-1",
  admin: "user-admin-1"
};

export function getPrimaryUser(role: Role): UserRecord | undefined {
  return mockUsers.find((user) => user.id === primaryUserByRole[role]);
}

export function getVisibleQuotes(role: Role): QuoteRecord[] {
  if (role === "admin") {
    return mockQuotes;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return mockQuotes.filter((quote) => quote.clientId === user.id);
  }

  return mockQuotes.filter((quote) => quote.pmId === user.id);
}

export function getVisibleProjects(role: Role): ProjectRecord[] {
  if (role === "admin") {
    return mockProjects;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return mockProjects.filter((project) => project.clientId === user.id);
  }

  return mockProjects.filter((project) => project.pmId === user.id);
}

export function getVisibleMessages(role: Role): MessageRecord[] {
  if (role === "admin") {
    return mockMessages;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  return mockMessages.filter((message) => message.senderId === user.id || message.recipientId === user.id);
}

export function getPmUsers() {
  return mockUsers.filter((user) => user.role === "pm");
}

export function getClientUsers() {
  return mockUsers.filter((user) => user.role === "client");
}
