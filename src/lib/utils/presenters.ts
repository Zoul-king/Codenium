import type { MessageStatus, PaymentStatus, ProjectStatus, QuoteStatus, Role } from "@/lib/types/domain";

const longDateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const shortDateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

const quoteStatusLabels: Record<QuoteStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  accepted: "Aceptada",
  rejected: "Rechazada"
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  discovery: "Definicion",
  design: "Diseno",
  build: "En desarrollo",
  qa: "Pruebas",
  done: "Entregado"
};

const messageStatusLabels: Record<MessageStatus, string> = {
  unread: "No leido",
  read: "Respondido"
};

const roleLabels: Record<Role, string> = {
  client: "Cliente",
  pm: "PM",
  admin: "Admin"
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  scheduled: "Programado"
};

export function formatLongDate(value: string) {
  return formatDate(value, longDateFormatter);
}

export function formatShortDate(value: string) {
  return formatDate(value, shortDateFormatter);
}

export function getQuoteStatusLabel(status: QuoteStatus) {
  return quoteStatusLabels[status];
}

export function getProjectStatusLabel(status: ProjectStatus) {
  return projectStatusLabels[status];
}

export function getMessageStatusLabel(status: MessageStatus) {
  return messageStatusLabels[status];
}

export function getRoleLabel(role: Role) {
  return roleLabels[role];
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  return paymentStatusLabels[status];
}

function formatDate(value: string, formatter: Intl.DateTimeFormat) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return formatter.format(date);
}
