import "server-only";

import type { PublicLeadPayload } from "@/server/email/types";
import { getCompanyInbox, getEmailConfig } from "@/server/email/config";
import { sendEmail } from "@/server/email/send-email";
import {
  buildChangeRequestEmail,
  buildClientWelcomeEmail,
  buildDashboardMessageEmail,
  buildDeliverableNotificationEmail,
  buildMeetingScheduledEmail,
  buildPmAccountCreatedEmail,
  buildProjectAssignmentEmail,
  buildQuoteStatusEmail
} from "@/server/email/templates/dashboard-events";
import type { QuoteStatus } from "@/lib/types/domain";
import { buildCompanyLeadEmail, buildLeadConfirmationEmail } from "@/server/email/templates/public-leads";

function formatReceivedAt() {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City"
  }).format(new Date());
}

export async function sendContactNotificationToCompany(lead: PublicLeadPayload) {
  const template = buildCompanyLeadEmail({ lead, receivedAt: formatReceivedAt() });

  return sendEmail({
    to: getCompanyInbox(lead.source),
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo: lead.email
  });
}

export async function sendQuoteNotificationToCompany(lead: PublicLeadPayload) {
  return sendContactNotificationToCompany(lead);
}

export async function sendContactConfirmationToLead(lead: PublicLeadPayload) {
  const config = getEmailConfig();
  const template = buildLeadConfirmationEmail({ lead, receivedAt: formatReceivedAt() });

  return sendEmail({
    to: lead.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo: config.visibleContactEmail
  });
}

export async function sendQuoteConfirmationToLead(lead: PublicLeadPayload) {
  return sendContactConfirmationToLead(lead);
}

export async function sendDashboardMessageEmail(input: {
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  senderName: string;
  senderRole: "client" | "pm";
  message: string;
}) {
  const template = buildDashboardMessageEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendChangeRequestEmail(input: {
  recipientEmail: string;
  recipientName: string;
  requestedBy: string;
  projectName: string;
  title: string;
  detail: string;
  priority: string;
}) {
  const template = buildChangeRequestEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendProjectAssignmentEmail(input: {
  recipientEmail: string;
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  projectName: string;
  counterpartLabel: string;
  counterpartName: string;
}) {
  const template = buildProjectAssignmentEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendClientWelcomeEmail(input: {
  clientEmail: string;
  clientName: string;
  dashboardUrl: string;
  quoteUrl: string;
}) {
  const template = buildClientWelcomeEmail({
    clientName: input.clientName,
    dashboardUrl: input.dashboardUrl,
    quoteUrl: input.quoteUrl
  });

  return sendEmail({
    to: input.clientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendPmAccountCreatedEmail(input: {
  pmEmail: string;
  pmName: string;
  tempPassword: string;
  loginUrl: string;
}) {
  const template = buildPmAccountCreatedEmail(input);

  return sendEmail({
    to: input.pmEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendDeliverableNotificationEmail(input: {
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  title: string;
  kind: string;
  fileName?: string;
  registeredBy: string;
}) {
  const template = buildDeliverableNotificationEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendQuoteStatusEmail(input: {
  recipientEmail: string;
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  status: QuoteStatus;
}) {
  const template = buildQuoteStatusEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}

export async function sendMeetingScheduledEmail(input: {
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  date: string;
  time: string;
  duration: string;
  meetingLink?: string;
  agenda?: string;
  hostName: string;
}) {
  const template = buildMeetingScheduledEmail(input);

  return sendEmail({
    to: input.recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html
  });
}
