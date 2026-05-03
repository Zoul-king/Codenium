import type { QuoteStatus } from "@/lib/types/domain";

export type PublicLeadSource = "contact" | "quote";

export interface PublicLeadPayload {
  source: PublicLeadSource;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  originPath: string;
  hiddenFields?: Record<string, string>;
}

export interface ApiActionResult {
  ok: boolean;
  message: string;
}

export interface DashboardProjectMessagePayload {
  type: "project_message";
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  senderName: string;
  senderRole: "client" | "pm";
  message: string;
}

export interface DashboardChangeRequestPayload {
  type: "change_request";
  recipientEmail: string;
  recipientName: string;
  requestedBy: string;
  projectName: string;
  title: string;
  detail: string;
  priority: string;
}

export interface DashboardDeliverablePayload {
  type: "deliverable_notification";
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  title: string;
  kind: string;
  fileName?: string;
  registeredBy: string;
}

export interface DashboardQuoteAssignmentPayload {
  type: "quote_assignment";
  quoteCode: string;
  quoteTitle: string;
  clientEmail: string;
  clientName: string;
  pmEmail: string;
  pmName: string;
  projectName: string;
}

export interface DashboardPmAccountCreatedPayload {
  type: "pm_account_created";
  pmEmail: string;
  pmName: string;
}

export interface DashboardQuoteStatusPayload {
  type: "quote_status_update";
  recipientEmail: string;
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  status: QuoteStatus;
}

export interface DashboardMeetingScheduledPayload {
  type: "meeting_scheduled";
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  date: string;
  time: string;
  duration: string;
  meetingLink?: string;
  agenda?: string;
  hostName: string;
}

export type DashboardNotificationPayload =
  | DashboardProjectMessagePayload
  | DashboardChangeRequestPayload
  | DashboardDeliverablePayload
  | DashboardQuoteAssignmentPayload
  | DashboardPmAccountCreatedPayload
  | DashboardQuoteStatusPayload
  | DashboardMeetingScheduledPayload;
